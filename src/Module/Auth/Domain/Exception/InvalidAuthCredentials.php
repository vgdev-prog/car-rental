<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Exception;

use App\Module\Auth\Domain\Enum\ErrorCode;
use App\Module\Common\Domain\Exception\AbstractDomainException;

class InvalidAuthCredentials extends AbstractDomainException
{
    public function __construct()
    {
        parent::__construct('Invalid credentials.');
    }

    public static function getDomainErrorCode(): string
    {
        return ErrorCode::INVALID_CREDENTIALS->value;
    }
}
