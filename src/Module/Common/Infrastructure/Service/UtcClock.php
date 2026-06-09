<?php

declare(strict_types=1);


namespace App\Module\Common\Infrastructure\Service;

use App\Module\Common\Domain\Contract\ClockInterface;
use Symfony\Component\Clock\ClockInterface as SymfonyClockInterface;
use Symfony\Component\DependencyInjection\Attribute\AsAlias;

#[AsAlias(ClockInterface::class)]
class UtcClock implements ClockInterface
{
    public function __construct(
        private SymfonyClockInterface $clock,
    )
    {
    }


    public function now(): \DateTimeImmutable
    {
        return $this->clock->withTimeZone('UTC')->now();
    }
}
