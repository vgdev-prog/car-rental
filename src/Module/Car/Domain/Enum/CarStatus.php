<?php

namespace App\Module\Car\Domain\Enum;

enum CarStatus: string
{
case ACTIVE = 'ACTIVE';
case INACTIVE = 'INACTIVE';
}
