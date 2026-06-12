<?php

declare(strict_types=1);

namespace App\Module\Common\Domain\Contract;

use DateTimeImmutable;

interface ClockInterface
{
    public function now(): DateTimeImmutable;
}
