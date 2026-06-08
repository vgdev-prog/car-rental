<?php

namespace App\Module\Auth\Domain\Entity;

use App\Module\Auth\Domain\ValueObject\Email;
use App\Module\Auth\Infrastructure\Repository\SessionRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SessionRepository::class)]
class Session
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'sessions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $token = null;

    #[ORM\Column(nullable: false)]
    private ?DateTimeImmutable $expiresAt = null;

    public function __construct(
        User              $user,
        string            $token,
        DateTimeImmutable $expiresAt
    )
    {
        $this->user = $user;
        $this->token = $token;
        $this->expiresAt = $expiresAt;
    }


    public function belongToUser(User $user): bool
    {
       return $this->user === $user;
    }

    public function isValid(DateTimeImmutable $now): bool
    {
        return $this->expiresAt > $now;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getToken(): string
    {
        return $this->token;
    }

    public function getExpiresAt(): \DateTimeImmutable
    {
        return $this->expiresAt;
    }



}
