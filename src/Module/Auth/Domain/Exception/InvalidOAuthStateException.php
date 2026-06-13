<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Exception;

use App\Module\Auth\Domain\Enum\ErrorCode;
use App\Module\Common\Domain\Exception\AbstractUnauthorizedException;

class InvalidOAuthStateException extends AbstractUnauthorizedException
{
    public function __construct(private readonly string $state)
    {
        parent::__construct('Invalid OAuth state');
    }

    public static function getDomainErrorCode(): string
    {
        return ErrorCode::INVALID_OAUTH_STATE->value;
    }

    public function getPublicContext(): array
    {
        return [
            'state' => $this->state,
        ];
    }

    public static function getExamplePublicContext(): array
    {
        return [
            'state' => '124515fdsjkdfsl;fj;l234',
        ];
    }
}
