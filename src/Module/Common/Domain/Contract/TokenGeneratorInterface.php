<?php

namespace App\Module\Common\Domain\Contract;

interface TokenGeneratorInterface
{
    /**
     * Returns a cryptographically secure opaque token (raw, unhashed).
     */
    public function generate():string;
}
