<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Exception;

use App\Module\Auth\Domain\Enum\ErrorCode;
use App\Module\Common\Domain\Exception\AbstractDomainException;

class CannotSendCodeWithoutPhone extends AbstractDomainException
{
    public function __construct()
    {
        parent::__construct('We can\'t send code to your phone number.');
    }

    public static function getDomainErrorCode(): string
    {
        return ErrorCode::CANNOT_SEND_WITHOUT_PHONE->value;
    }
}
