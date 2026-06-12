<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Enum;

enum Status: string
{
    case ACTIVE = 'ACTIVE';
    case BLOCKED = 'BLOCKED';
    case PENDING = 'PENDING';
}
