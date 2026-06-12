<?php

declare(strict_types=1);

namespace App\Module\Common\Domain\Contract;

interface RequestInterface
{
    public function toCommand(): CommandInterface;
}
