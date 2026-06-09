<?php

namespace App\Module\Common\Domain\Contract;

interface ClockInterface
{
    public function now(): \DateTimeImmutable;
}
