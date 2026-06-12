<?php

declare(strict_types=1);

namespace App\Module\Auth\Application\UseCase;

use App\Module\Auth\Application\UseCase\Input\ConfirmLoginOAuthCommand;
use App\Module\Auth\Domain\Contracts\OAuthProviderInterface;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\DependencyInjection\Attribute\AutowireLocator;

class ConfirmOAuthUrlHandler
{
    public function __construct(
        #[AutowireLocator('app.oauth_provider')]
        private readonly ContainerInterface $providers,
    ) {
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle(ConfirmLoginOAuthCommand $command): void
    {
        /** @var OAuthProviderInterface $oauthProvider */
        $oauthProvider = $this->providers->get($command->provider->name);
        $oauthProvider->authorize($command->code);
    }
}
