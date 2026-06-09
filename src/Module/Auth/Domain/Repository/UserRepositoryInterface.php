<?php

namespace App\Module\Auth\Domain\Repository;


use App\Module\Auth\Domain\Entity\User;

interface UserRepositoryInterface
{
    public function findByMail(string $mail): ?User;
}
