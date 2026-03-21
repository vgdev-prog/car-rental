<?php

namespace App\Module\Car\Infrastructure\Repository;

use App\Module\Car\Domain\Entity\Maintenance;
use App\Module\Car\Domain\Repository\MaintenanceRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Maintenance>
 */
class MaintenanceRepository extends ServiceEntityRepository implements MaintenanceRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Maintenance::class);
    }
}
