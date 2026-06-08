<?php

namespace App\Module\Auth\Domain\Repository;

use App\Module\Auth\Domain\Entity\Session;

interface SessionRepositoryInterface
{
    public function save(Session $entity): void;

    public function remove(Session $entity): void;
}
