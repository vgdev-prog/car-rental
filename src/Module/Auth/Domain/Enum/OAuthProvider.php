<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Enum;

enum OAuthProvider: string
{
    case GOOGLE = 'GOOGLE';
    case LINKEDIN = 'LINKEDIN';
    case FACEBOOK = 'FACEBOOK';
}
