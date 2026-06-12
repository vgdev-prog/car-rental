<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\ValueObject;

use App\Module\Auth\Domain\Enum\OAuthProvider;

class NetworkUser
{
    public function __construct(
        public string $identity,
        public string $email,
        public string $name,
        public OAuthProvider $provider,
        public bool $verified,
        public ?string $surname = null,
        public ?string $phone = null,
        public ?string $avatar = null,
    ) {
    }
}
