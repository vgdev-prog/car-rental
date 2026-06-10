<?php

namespace App\Module\Auth\Domain\Enum;

enum Channel: string
{
    case PHONE = 'PHONE';
    case EMAIL = 'EMAIL';
}
