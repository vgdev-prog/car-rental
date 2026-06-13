<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Repository;

use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\Repository\UserRepositoryInterface;
use App\Module\Auth\Domain\ValueObject\Email;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Component\DependencyInjection\Attribute\AsAlias;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
#[AsAlias(UserRepositoryInterface::class)]
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface, UserRepositoryInterface, UserLoaderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findByEmail(Email $email): ?User
    {
        return $this->findOneBy(['email' => $email->value()]);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->changePassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findByMail(Email $mail): ?User
    {
        return $this->findOneBy(['email' => $mail->value()]);
    }

    public function findByPhone(string $phone): ?User
    {
        return $this->findOneBy(['phone' => $phone]);
    }

    public function loadUserByIdentifier(string $identifier): ?User
    {
        return $this->createQueryBuilder('u')
            ->where('u.email = :identifier')
            ->orWhere('u.phone = :identifier')
            ->setParameter('identifier', $identifier)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
