<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Service;

use App\Module\Auth\Domain\Contracts\OAuthProviderInterface;
use App\Module\Auth\Domain\Enum\OAuthProvider;
use App\Module\Auth\Domain\ValueObject\NetworkUser;
use GuzzleHttp\Exception\GuzzleException;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\Google;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;

#[AsTaggedItem(index: 'GOOGLE')]
class GoogleOAuthProvider implements OAuthProviderInterface
{
    public function __construct(
        private Google $provider,
    ) {
    }

    public function buildAuthorizationUrl(string $state): string
    {
        return $this->provider->getAuthorizationUrl(['state' => $state, 'scope' => ['openid', 'profile', 'email']]);
    }

    /**
     * @throws GuzzleException
     * @throws IdentityProviderException
     */
    public function authorize(string $code): NetworkUser
    {
        $token = $this->provider->getAccessToken('authorization_code', ['code' => $code]);
        $owner = $this->provider->getResourceOwner($token);

        return new NetworkUser(
            identity: $owner->getId(),
            email: $owner->getEmail(),
            name: $owner->getFirstName(),
            provider: OAuthProvider::GOOGLE,
            verified: true,
            surname: $owner->getLastName(),
            phone: null,
            avatar: $owner->getAvatar(),
        );
    }
}
