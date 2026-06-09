<?php

namespace App\Module\Auth\Domain\Repository;


use App\Module\Auth\Domain\Entity\Session;

interface SessionRepositoryInterface
{
    public function findByToken(string $token): ?Session;
}
