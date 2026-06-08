<?php

namespace App\Module\Common\Domain\Contract;

interface RequestInterface
{
    public function toCommand();
}
