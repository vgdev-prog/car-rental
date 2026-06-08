<?php

namespace App\Module\Common\Infrastructure\Resource;


class AbstractPaginatedCollectionResource
{

    public array $data = [];
    public PaginationMetadataResource $meta;
}
