<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Exception;

use App\Module\Auth\Domain\Enum\ErrorCode;
use App\Module\Common\Domain\Exception\AbstractDomainException;

class UserNotConfirmedException extends AbstractDomainException
{
    public function __construct()
    {
        parent::__construct('User not verified');
    }

    public static function getDomainErrorCode(): string
    {
        return ErrorCode::USER_NOT_CONFIRMED->value;
    }
}
