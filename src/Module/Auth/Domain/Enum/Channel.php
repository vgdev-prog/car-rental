<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Enum;

enum Channel: string
{
    case PHONE = 'PHONE';
    case EMAIL = 'EMAIL';
}
