<?php

declare(strict_types=1);


namespace App\Module\Auth\Application\UseCase;

use App\Module\Auth\Application\UseCase\Input\LoginByPhoneCommand;
use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\Exception\UserNotFoundException;
use App\Module\Auth\Domain\Repository\UserRepositoryInterface;
use App\Module\Common\Domain\Contract\PersisterInterface;
use App\Module\Common\Domain\Contract\SmsSenderInterface;

class LoginByPhoneHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private SmsSenderInterface $smsSender,
        private PersisterInterface $persister,
    )
    {
    }

    /**
     * @throws UserNotFoundException
     */
    public function handle(LoginByPhoneCommand $command): User
    {
        $user = $this->userRepository->findByPhone($command->phone);
        $code = $this->generateRandomCode();

        if (!$user) {
            $user = User::createFromPhone($command->phone, hash(User::HASH_ALGORITHM, $code));
        }

        if (!$user->getPhone()) {

        }


        $message = sprintf(
            'Hello. Your CitiCarRentals code: %s. Valid for 10 minutes. Never share it with anyone.',
            $code
        );

        $this->smsSender->send($command->phone, $message);

        $user->issueVerificationCode($code);
        $this->persister->persist($user);
        $this->persister->flush();

        return $user;

    }

    private function generateRandomCode(): string
    {
        return (string) random_int(111111, 999999);
    }
}
