<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\ValueObject;

use App\Module\Auth\Domain\Entity\Session;
use DateTimeImmutable;

readonly class TokenIssue
{
    public function __construct(
        public Session $session,
        public DateTimeImmutable $expiresAt,
        public string $token,
    ) {
    }
}
