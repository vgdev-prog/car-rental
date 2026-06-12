<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Resource;

use App\Module\Auth\Domain\Entity\User;
use JsonSerializable;

class UserResource implements JsonSerializable
{
    public ?int $id;

    public string $email;

    public array $roles;
    public ?string $phone;

    public function __construct()
    {
    }

    public static function make(User $user): self
    {
        $resource = new self();
        $resource->id = $user->getId();
        $resource->roles = $user->getRoles();
        $resource->email = (string) $user->getEmail();
        $resource->phone = $user->getPhone();

        return $resource;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'roles' => $this->roles,
            'phone' => $this->phone,
        ];
    }
}
