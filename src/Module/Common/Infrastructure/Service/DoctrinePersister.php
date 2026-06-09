<?php

declare(strict_types=1);


namespace App\Module\Common\Infrastructure\Service;

use App\Module\Common\Domain\Contract\PersisterInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\AsAlias;

#[AsAlias(PersisterInterface::class)]
class DoctrinePersister implements PersisterInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    )
    {
    }

    public function persist(object $entity): void
    {
        $this->entityManager->persist($entity);
    }

    public function flush(): void
    {
        $this->entityManager->flush();
    }
}
