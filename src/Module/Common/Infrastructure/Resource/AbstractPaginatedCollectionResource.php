<?php

declare(strict_types=1);

namespace App\Module\Common\Infrastructure\Resource;

class AbstractPaginatedCollectionResource
{
    public array $data = [];
    public PaginationMetadataResource $meta;
}
