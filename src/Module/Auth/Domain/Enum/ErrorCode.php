<?php

namespace App\Module\Auth\Domain\Enum;

enum ErrorCode: string
{
    case INVALID_MAIL_FORMAT  = 'INVALID_MAIL_FORMAT';
    case INVALID_CREDENTIALS   = 'INVALID_CREDENTIALS';

}
