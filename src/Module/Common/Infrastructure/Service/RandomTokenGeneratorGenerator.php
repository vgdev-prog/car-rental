<?php

declare(strict_types=1);


namespace App\Module\Common\Infrastructure\Service;

use App\Module\Common\Domain\Contract\TokenGeneratorInterface;
use Random\RandomException;
use Symfony\Component\DependencyInjection\Attribute\AsAlias;

#[AsAlias(TokenGeneratorInterface::class)]
class RandomTokenGeneratorGenerator implements TokenGeneratorInterface
{

    /**
     * @throws RandomException
     */
    public function generate(): string
    {
        return bin2hex(random_bytes(32));
    }
}
