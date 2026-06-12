<?php

declare(strict_types=1);

namespace App\Module\Auth\Application\UseCase\Input;

use App\Module\Auth\Domain\Enum\OAuthProvider;

class ConfirmLoginOAuthCommand
{
    public function __construct(
        public string $code,
        public OAuthProvider $provider,
    ) {
    }
}
