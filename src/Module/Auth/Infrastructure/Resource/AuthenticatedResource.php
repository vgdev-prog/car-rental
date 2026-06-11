<?php

declare(strict_types=1);


namespace App\Module\Auth\Infrastructure\Resource;

use App\Module\Auth\Domain\Entity\User;
use DateTimeImmutable;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticatedResource
{
    public string $token;
    public string $expiresAt;
    public UserResource $user;

    public static function make(string $token, DateTimeImmutable $expiresAt, User $user): self
    {
        $resource = new self();
        $resource->token = $token;
        $resource->expiresAt = $expiresAt->format('Y-m-d H:i:s');
        $resource->user = UserResource::make($user);
        return $resource;
    }
}
