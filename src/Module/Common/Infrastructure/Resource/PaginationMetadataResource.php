<?php

namespace App\Module\Common\Infrastructure\Resource;


use Doctrine\ORM\Tools\Pagination\Paginator;


class PaginationMetadataResource
{
    private function __construct()
    {
    }

    public float $current_page;
    public int $last_page;
    public int $per_page;
    public int $total;

    /**
     * @template TEntity of object
     * @param Paginator<TEntity> $paginator
     * @return self
     */
    public static function makeFromPaginator(Paginator $paginator): self
    {
        $total = count($paginator);
        $perPage = $paginator->getQuery()->getMaxResults();
        $offset = $paginator->getQuery()->getFirstResult();

        if (!$perPage) {
            throw new \LogicException('Pagination metadata requires at least one per page.');
        }

        if (!$offset) {
            throw new \LogicException('Pagination metadata requires at least one offset.');
        }

        $resource = new self();
        $resource->total =  $total;
        $resource->per_page =  $perPage;
        $resource->current_page = floor($offset / $perPage) + 1;
        $resource->last_page = (int) ceil($total / $perPage);

        return $resource;
    }

}
