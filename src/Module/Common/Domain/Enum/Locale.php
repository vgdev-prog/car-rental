<?php

declare(strict_types=1);

namespace App\Module\Common\Domain\Enum;

enum Locale: string
{
    case ENGLISH = 'en';
    case FRENCH = 'fr';
}
