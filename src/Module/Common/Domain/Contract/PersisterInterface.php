<?php

declare(strict_types=1);

namespace App\Module\Common\Domain\Contract;

interface PersisterInterface
{
    public function persist(object $entity): void;

    public function flush(): void;
}
