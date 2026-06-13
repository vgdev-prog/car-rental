<?php

declare(strict_types=1);

namespace App\Module\Auth\Application\UseCase;

use App\Module\Auth\Application\Service\AuthTokenIssuer;
use App\Module\Auth\Application\UseCase\Input\ConfirmLoginOAuthCommand;
use App\Module\Auth\Domain\Contracts\OAuthProviderInterface;
use App\Module\Auth\Domain\Entity\Network;
use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\Exception\EmailAlreadyApprovedException;
use App\Module\Auth\Domain\Repository\UserRepositoryInterface;
use App\Module\Auth\Domain\ValueObject\Email;
use App\Module\Auth\Domain\ValueObject\TokenIssue;
use App\Module\Common\Domain\Contract\PersisterInterface;
use DateTimeImmutable;
use Predis\Command\Argument\Server\To;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\DependencyInjection\Attribute\AutowireLocator;

class ConfirmOAuthUrlHandler
{
    public function __construct(
        #[AutowireLocator('app.oauth_provider')]
        private readonly ContainerInterface $providers,
        private readonly UserRepositoryInterface $userRepository,
        private readonly PersisterInterface $persister,
        private readonly AuthTokenIssuer $authTokenIssuer,
    ) {
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws EmailAlreadyApprovedException
     */
    public function handle(ConfirmLoginOAuthCommand $command): TokenIssue
    {
        /** @var OAuthProviderInterface $oauthProvider */
        $oauthProvider = $this->providers->get($command->provider->name);
        $networkUser = $oauthProvider->authorize($command->code);

        $email = Email::fromString($networkUser->email);

        $user = $this->userRepository->findByMail($email);

        if (!$user) {
            $user = User::createFromEmail($email, null);
            $user->confirmMail(new DateTimeImmutable());
        }

        $network = Network::createNetwork($networkUser);
        $user->connectNetwork($network);

        $issue = $this->authTokenIssuer->openSession($user);

        $this->persister->persist($issue);
        $this->persister->persist($network);
        $this->persister->persist($user);

        $this->persister->flush();

        return $issue;
    }
}
