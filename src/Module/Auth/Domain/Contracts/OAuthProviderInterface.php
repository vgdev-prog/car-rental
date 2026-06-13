<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\Contracts;

use App\Module\Auth\Domain\ValueObject\NetworkUser;

interface OAuthProviderInterface
{
    public function buildAuthorizationUrl(string $state): string;

    public function authorize(string $code): NetworkUser;
}
