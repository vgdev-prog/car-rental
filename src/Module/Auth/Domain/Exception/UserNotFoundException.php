<?php

declare(strict_types=1);


namespace App\Module\Auth\Domain\Exception;

use App\Module\Auth\Domain\Enum\ErrorCode;
use App\Module\Common\Domain\Exception\AbstractDomainException;

class UserNotFoundException extends AbstractDomainException
{
    public function __construct()
    {
        parent::__construct('User not found');
    }

    public static function getDomainErrorCode(): string
    {
        return ErrorCode::USER_NOT_FOUND->value;
    }
}
