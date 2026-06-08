<?php

namespace App\Module\Auth\Infrastructure\Repository;

use App\Module\Auth\Domain\Entity\Network;
use App\Module\Auth\Domain\Repository\NetworkRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Network>
 */
class NetworkRepository extends ServiceEntityRepository implements NetworkRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Network::class);
    }

    public function save(Network $entity): void
    {
        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
    }

    public function remove(Network $entity): void
    {
        $this->getEntityManager()->remove($entity);
        $this->getEntityManager()->flush();
    }
}
