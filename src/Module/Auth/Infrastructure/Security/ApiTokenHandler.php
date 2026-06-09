<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Security;

use App\Module\Auth\Domain\Repository\SessionRepositoryInterface;
use App\Module\Common\Domain\Exception\ResourceNotFoundException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class ApiTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private SessionRepositoryInterface $sessionRepository,
    )
    {
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function getUserBadgeFrom(#[\SensitiveParameter] string $accessToken): UserBadge
    {
       $token = $this->sessionRepository->findByToken(hash('sha256',$accessToken));

       if (!$token) {
           throw new ResourceNotFoundException('Token not found');
       }

        return new UserBadge(
            $token->getUser()->getUserIdentifier(),
            static fn () => $token->getUser(),
        );

    }
}
