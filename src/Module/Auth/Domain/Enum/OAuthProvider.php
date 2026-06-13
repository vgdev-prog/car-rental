<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Enum;

enum OAuthProvider: string
{
    case GOOGLE = 'google';
    case LINKEDIN = 'linkedin';
    case FACEBOOK = 'facebook';
}
