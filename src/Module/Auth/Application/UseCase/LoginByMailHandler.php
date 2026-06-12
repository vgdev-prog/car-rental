<?php

declare(strict_types=1);

namespace App\Module\Auth\Application\UseCase;

use App\Module\Auth\Application\Service\AuthTokenIssuer;
use App\Module\Auth\Application\UseCase\Input\LoginByMailCommand;
use App\Module\Auth\Domain\Exception\UserNotFoundException;
use App\Module\Auth\Domain\Repository\UserRepositoryInterface;
use App\Module\Auth\Domain\ValueObject\TokenIssue;
use App\Module\Common\Domain\Contract\PersisterInterface;

class LoginByMailHandler
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly AuthTokenIssuer $authTokenIssuer,
        private readonly PersisterInterface $persister,
    ) {
    }

    /**
     * @throws UserNotFoundException
     */
    public function handle(LoginByMailCommand $command): TokenIssue
    {
        $user = $this->userRepository->findByMail($command->email);

        if (!$user) {
            throw new UserNotFoundException();
        }

        $issue = $this->authTokenIssuer->openSession($user);

        $this->persister->persist($issue->session);
        $this->persister->flush();

        return $issue;
    }
}
