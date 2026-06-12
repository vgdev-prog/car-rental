<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Entity;

use App\Module\Auth\Domain\Enum\Role;
use App\Module\Auth\Domain\Enum\Status;
use App\Module\Auth\Domain\Exception\EmailAlreadyApprovedException;
use App\Module\Auth\Domain\ValueObject\Email;
use App\Module\Auth\Infrastructure\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use LogicException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Table(name: 'users')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const HASH_ALGORITHM = 'sha256';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'email', length: 180, unique: true, nullable: true)]
    private ?Email $email;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $code = null;

    #[ORM\Column(enumType: Status::class)]
    private Status $status = Status::PENDING;

    /**
     * @var list<Role> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var ?string The hashed password
     */
    #[ORM\Column(nullable: true)]
    private ?string $password;

    /**
     * @var Collection<int, Session>
     */
    #[ORM\OneToMany(targetEntity: Session::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $sessions;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $emailApprovedAt = null;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $phoneApprovedAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $passwordResetToken = null;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $passwordResetTokenExpiresAt = null;

    /**
     * @var Collection<int, Network>
     */
    #[ORM\OneToMany(targetEntity: Network::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $networks;

    private function __construct()
    {
        $this->sessions = new ArrayCollection();
        $this->grantRole(Role::from('ROLE_USER'));
        $this->networks = new ArrayCollection();
    }

    public static function createFromEmail(Email $email, string $password): self
    {
        $user = new self();
        $user->email = $email;
        $user->password = $password;

        return $user;
    }

    public static function createFromPhone(string $phone, string $hash): self
    {
        $user = new self();
        $user->phone = $phone;
        $user->code = $hash;

        return $user;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?Email
    {
        return $this->email;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        if (!$this->email || !$this->phone) {
            throw new LogicException('User identifier is not set.');
        }

        return (string) $this->email ?: $this->phone;
    }

    public function changeEmail(Email $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function changePassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function changePhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function maskPhone(): string
    {
        if (!$this->phone) {
            return '';
        }
        $head = mb_substr($this->phone, 0, 4);
        $tail = mb_substr($this->phone, -2);
        $hidden = max(0, mb_strlen($this->phone) - 6);

        return $head.str_repeat('•', $hidden).$tail;
    }

    public function getPhoneApprovedAt(): ?DateTimeImmutable
    {
        return $this->phoneApprovedAt;
    }

    public function approvePhone(): static
    {
        $this->phoneApprovedAt = new DateTimeImmutable();
        $this->status = Status::ACTIVE;

        return $this;
    }

    public function issueVerificationCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getEmailApprovedAt(): ?DateTimeImmutable
    {
        return $this->emailApprovedAt;
    }

    /**
     * @throws EmailAlreadyApprovedException
     */
    public function confirmMail(DateTimeImmutable $now): void
    {
        if (!$this->emailApprovedAt) {
            throw new EmailAlreadyApprovedException();
        }

        $this->emailApprovedAt = $now;
    }

    public function isConfirmed(): bool
    {
        return null !== $this->emailApprovedAt || null !== $this->phoneApprovedAt;
    }

    public function requestPasswordReset(string $token, DateTimeImmutable $now): void
    {
        $this->passwordResetToken = $token;
        $this->passwordResetTokenExpiresAt = $now;
    }

    public function isPasswordResetTokenValid(DateTimeImmutable $now): bool
    {
        return $this->passwordResetTokenExpiresAt <= $now;
    }

    public function resetPassword(string $hashedPassword): void
    {
        $this->password = $hashedPassword;
        $this->passwordResetToken = null;
        $this->passwordResetTokenExpiresAt = null;
    }

    /**
     * @return array<string>
     *
     * @see UserInterface
     */
    public function getRoles(): array
    {
        return array_map(static fn (Role $role) => $role->value, $this->roles);
    }

    public function grantRole(Role $role): static
    {
        if (!in_array($role, $this->roles, true)) {
            $this->roles[] = $role;
        }

        return $this;
    }

    public function revokeRole(Role $role): static
    {
        $this->roles = array_values(
            array_filter($this->roles, static fn (Role $userRole) => $userRole !== $role)
        );

        return $this;
    }

    /**
     * @return Collection<int, Session>
     */
    public function getSessions(): Collection
    {
        return $this->sessions;
    }

    /**
     * @return Collection<int, Network>
     */
    public function getNetworks(): Collection
    {
        return $this->networks;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0".self::class."\0password"] = hash('crc32c', $this->password ?? '');

        return $data;
    }
}
