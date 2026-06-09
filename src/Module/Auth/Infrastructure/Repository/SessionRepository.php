<?php

namespace App\Module\Auth\Infrastructure\Repository;

use App\Module\Auth\Domain\Entity\Session;
use App\Module\Auth\Domain\Repository\SessionRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Session>
 */
class SessionRepository extends ServiceEntityRepository implements SessionRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Session::class);
    }

    public function findByToken(string $token): ?Session
    {
        return $this->findOneBy(['token' => $token]);
    }
}
