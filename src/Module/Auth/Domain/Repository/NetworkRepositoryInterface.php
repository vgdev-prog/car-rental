<?php

namespace App\Module\Auth\Domain\Repository;

use App\Module\Auth\Domain\Entity\Network;

interface NetworkRepositoryInterface
{
    public function save(Network $entity): void;

    public function remove(Network $entity): void;
}
