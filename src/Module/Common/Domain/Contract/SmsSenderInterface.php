<?php

declare(strict_types=1);

namespace App\Module\Common\Domain\Contract;

interface SmsSenderInterface
{
    public function send(string $phone, string $code): void;
}
