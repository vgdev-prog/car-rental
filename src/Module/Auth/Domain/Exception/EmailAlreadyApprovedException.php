<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Exception;

use App\Module\Auth\Domain\Enum\ErrorCode;
use App\Module\Common\Domain\Exception\AbstractDomainException;

class EmailAlreadyApprovedException extends AbstractDomainException
{
    public function __construct()
    {
        parent::__construct('Email already approved.');
    }

    public static function getDomainErrorCode(): string
    {
        return ErrorCode::EMAIL_ALREADY_APPROVED->value;
    }
}
