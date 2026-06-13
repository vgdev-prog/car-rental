<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Repository;

use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\ValueObject\Email;

interface UserRepositoryInterface
{
    public function findByMail(Email $mail): ?User;

    public function findByPhone(string $phone): ?User;
}
