<?php

namespace App\Module\Auth\Domain\Contracts;

use App\Module\Auth\Domain\ValueObject\Email;

interface UserMailerInterface
{
    public function sendWelcomeMail(Email $email, string $token): void;
}
