<?php

declare(strict_types=1);


namespace App\Module\Auth\Application\Service;

use App\Module\Auth\Domain\Entity\Session;
use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\ValueObject\TokenIssue;
use App\Module\Common\Domain\Contract\ClockInterface;
use App\Module\Common\Domain\Contract\TokenGeneratorInterface;

class AuthTokenIssuer
{
    public const DEFAULT_TTL = '+7 days';
    public const EXTENDED_TTL = '+30 days';

    public const HASH_ALGO = 'sha256';

    public function __construct(
        private ClockInterface          $clock,
        private TokenGeneratorInterface $tokenGenerator
    )
    {
    }

    public function openSession(User $user, bool $extendedTtl = false): TokenIssue
    {
        $ttl = $extendedTtl ? self::EXTENDED_TTL : self::DEFAULT_TTL;

        $expires = $this->clock->now()->modify($ttl);

        $token = $this->tokenGenerator->generate();

        $session = new Session($user, hash(self::HASH_ALGO, $token), $expires);

        return new TokenIssue(session: $session, expiresAt: $expires, token: $token);
    }


}
