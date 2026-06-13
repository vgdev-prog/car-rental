<?php

declare(strict_types=1);

namespace App\Module\Auth\Application\UseCase;

use App\Module\Auth\Domain\Contracts\OAuthProviderInterface;
use App\Module\Auth\Domain\Enum\OAuthProvider;
use Psr\Container\ContainerInterface;
use Symfony\Component\DependencyInjection\Attribute\AutowireLocator;

readonly class GenerateOAuthUrlHandler
{
    public function __construct(
        #[AutowireLocator('app.oauth_provider')]
        private ContainerInterface $providers,
    ) {
    }

    public function handle(OAuthProvider $provider, string $state): string
    {
        /** @var OAuthProviderInterface $oauthProvider */
        $oauthProvider = $this->providers->get($provider->name);

        return $oauthProvider->buildAuthorizationUrl($state);
    }
}
