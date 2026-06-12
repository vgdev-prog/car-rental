<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Service;

use App\Module\Auth\Domain\Contracts\OAuthProviderInterface;
use App\Module\Auth\Domain\Enum\OAuthProvider;
use App\Module\Auth\Domain\ValueObject\NetworkUser;
use GuzzleHttp\Exception\GuzzleException;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\Facebook;
use League\OAuth2\Client\Token\AccessToken;
use LogicException;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;

#[AsTaggedItem(index: 'FACEBOOK')]
readonly class FacebookOAuthProvider implements OAuthProviderInterface
{
    public function __construct(
        private Facebook $provider,
    ) {
    }

    public function buildAuthorizationUrl(string $state): string
    {
        return $this->provider->getAuthorizationUrl(['scope' => ['public_profile', 'email'], 'state' => $state]);
    }

    /**
     * @throws GuzzleException
     * @throws IdentityProviderException
     */
    public function authorize(string $code): NetworkUser
    {
        $token = $this->provider->getAccessToken('authorization_code', [
            'code' => $code,
        ]);
        if (!$token instanceof AccessToken) {
            throw new LogicException('ffksdf');
        }

        $owner = $this->provider->getResourceOwner($token);

        return new NetworkUser(
            identity: $owner->getId(),
            email: $owner->getEmail(),
            name: $owner->getName(),
            provider: OAuthProvider::FACEBOOK,
            verified: true,
        );
    }
}
