<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Service;

use App\Module\Auth\Domain\Contracts\OAuthProviderInterface;
use App\Module\Auth\Domain\Enum\OAuthProvider;
use App\Module\Auth\Domain\ValueObject\NetworkUser;
use GuzzleHttp\Exception\GuzzleException;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[AsTaggedItem(index: 'LINKEDIN')]
readonly class LinkedInOAuthProvider implements OAuthProviderInterface
{
    public function __construct(
        #[Autowire(service: 'oauth.provider.linkedin')]
        private GenericProvider $provider,
    ) {
    }

    public function buildAuthorizationUrl(string $state): string
    {
        return $this->provider->getAuthorizationUrl(['state' => $state]);
    }

    /**
     * @throws GuzzleException
     * @throws IdentityProviderException
     */
    public function authorize(string $code): NetworkUser
    {
        $token = $this->provider->getAccessToken('authorization_code', ['code' => $code]);
        $claims = $this->provider->getResourceOwner($token);

        return new NetworkUser(
            identity: $claims->getId(),
            email: $claims->getEmail(),
            name: $claims->getName(),
            provider: OAuthProvider::LINKEDIN,
            verified: true,
        );
    }
}
