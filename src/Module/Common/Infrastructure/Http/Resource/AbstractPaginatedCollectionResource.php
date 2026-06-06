<?php

namespace App\Module\Common\Infrastructure\Http\Resource;


class AbstractPaginatedCollectionResource
{

    public array $data = [];
    public PaginationMetadataResource $meta;
}
