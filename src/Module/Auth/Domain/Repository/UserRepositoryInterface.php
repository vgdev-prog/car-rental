<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Repository;

use App\Module\Auth\Domain\Entity\User;

interface UserRepositoryInterface
{
    public function findByMail(string $mail): ?User;

    public function findByPhone(string $phone): ?User;
}
