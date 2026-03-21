<?php

namespace App\Module\Car\Domain\Repository;



interface CarRepositoryInterface
{
    public function findActiveCars(): array;
}
