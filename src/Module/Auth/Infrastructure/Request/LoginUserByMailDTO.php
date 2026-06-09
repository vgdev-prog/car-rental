<?php

declare(strict_types=1);


namespace App\Module\Auth\Infrastructure\Request;

use Symfony\Component\Validator\Constraints as Assert;

class LoginUserByMailDTO
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public ?string $email;

    #[Assert\NotBlank]
    public ?string $password;

    public static function fromArray(array $data): self
    {
        $resource = new self();
        $resource->email = $data['email'] ?? null;
        $resource->password = $data['password'] ?? null;
        return $resource;
    }
}
