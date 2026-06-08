<?php

namespace App\Module\Auth\Domain\Entity;

use _PHPStan_584420d24\Nette\Neon\Exception;
use App\Module\Auth\Domain\Enum\Role;
use App\Module\Auth\Domain\Enum\Status;
use App\Module\Auth\Domain\ValueObject\Email;
use App\Module\Auth\Infrastructure\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'users')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'email', length: 180, unique: true)]
    private Email $email;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(enumType: Status::class)]
    private Status $status = Status::PENDING;

    /**
     * @var list<Role> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private string $password;

    /**
     * @var Collection<int, Session>
     */
    #[ORM\OneToMany(targetEntity: Session::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $sessions;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $emailApprovedAt = null;

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

    public function createFromEmail(Email $email, string $password): self
    {
        $user = new self();
        $user->email = $email;
        $user->password = $password;

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
        return (string)$this->email;
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


    public function confirmMail(DateTimeImmutable $now): void
    {
        if (!$this->emailApprovedAt) {
            throw new Exception('');
        }

        $this->emailApprovedAt = $now;
    }

    public function isEmailConfirmed(): bool
    {
        return $this->emailApprovedAt !== null;
    }

    public function requestPasswordReset(string $token, DateTimeImmutable $now): void
    {
        $this->passwordResetToken = $token;
        $this->passwordResetTokenExpiresAt = $now;
    }

    public function isPasswordResetTokenValid(DateTimeImmutable $now): bool
    {
        return  $this->passwordResetTokenExpiresAt <= $now;
    }

    public function resetPassword(string $hashedPassword): void
    {
        $this->password = $hashedPassword;
        $this->passwordResetToken = null;
        $this->passwordResetTokenExpiresAt = null;
    }


    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        return array_values($roles);
    }

    /**
     * @param Role $role
     * @return User
     */
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
            array_filter($this->roles, static fn(string $userRole) => $userRole !== $role)
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

    public function addSession(Session $session): static
    {
        if (!$this->sessions->contains($session)) {
            $this->sessions->add($session);
            $session->setUser($this);
        }

        return $this;
    }

    public function removeSession(Session $session): static
    {
        if ($this->sessions->removeElement($session)) {
            // set the owning side to null (unless already changed)
            if ($session->getUser() === $this) {
                $session->setUser(null);
            }
        }

        return $this;
    }



    public function getEmailApprovedAt(): ?DateTimeImmutable
    {
        return $this->emailApprovedAt;
    }

    public function setEmailApprovedAt(?DateTimeImmutable $emailApprovedAt): static
    {
        $this->emailApprovedAt = $emailApprovedAt;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array)$this;
        $data["\0" . self::class . "\0password"] = hash('crc32c', $this->password);

        return $data;
    }


    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }

    /**
     * @return Collection<int, Network>
     */
    public function getNetworks(): Collection
    {
        return $this->networks;
    }
}
