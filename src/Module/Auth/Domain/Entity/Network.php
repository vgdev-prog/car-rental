<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Entity;

use App\Module\Auth\Domain\Enum\OAuthProvider;
use App\Module\Auth\Domain\ValueObject\NetworkUser;
use App\Module\Auth\Infrastructure\Repository\NetworkRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NetworkRepository::class)]
class Network
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false, enumType: OAuthProvider::class)]
    private OAuthProvider $provider;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $providerUserId;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $email;

    #[ORM\Column(nullable: false)]
    private ?DateTimeImmutable $connectedAt;

    #[ORM\ManyToOne(inversedBy: 'networks')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    public function __construct(
    ) {
        $this->connectedAt = new DateTimeImmutable();
    }

    public static function createNetwork(NetworkUser $user): self
    {
        $network = new self();
        $network->provider = $user->provider;
        $network->providerUserId = $user->identity;
        $network->email = $user->email;

        return $network;
    }

    public function assignToUser(User $user): void
    {
        $this->user = $user;
    }

    public function belongsTo(User $user): bool
    {
        return $this->user === $user;
    }

    public function matches(OAuthProvider $provider, string $providerId): bool
    {
        return $this->getProvider() === $provider && $providerId === $this->providerUserId;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function getProvider(): ?OAuthProvider
    {
        return $this->provider;
    }

    public function getProviderUserId(): ?string
    {
        return $this->providerUserId;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function getConnectedAt(): ?DateTimeImmutable
    {
        return $this->connectedAt;
    }
}
