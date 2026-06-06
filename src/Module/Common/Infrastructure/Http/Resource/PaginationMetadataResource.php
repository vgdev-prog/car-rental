<?php

namespace App\Module\Common\Infrastructure\Http\Resource;


use Doctrine\ORM\Tools\Pagination\Paginator;

class PaginationMetadataResource
{
    private function __construct()
    {
    }

    public int $current_page;
    public int $last_page;
    public int $per_page;
    public int $total;

    public static function makeFromPaginator(Paginator $paginator): PaginationMetadataResource
    {
        $total = count($paginator);
        $perPage = $paginator->getQuery()->getMaxResults();
        $offset = $paginator->getQuery()->getFirstResult();

        $resource = new self();
        $resource->total = $total;
        $resource->per_page = $perPage;
        $resource->current_page = (int) floor($offset / $perPage) + 1;
        $resource->last_page = ceil($total / $perPage);

        return $resource;
    }

}
