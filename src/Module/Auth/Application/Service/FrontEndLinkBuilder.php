<?php

declare(strict_types=1);

namespace App\Module\Auth\Application\Service;

class FrontEndLinkBuilder
{
    public function __construct(
        private string $frontendUrl,
    ) {
    }

    public function approveMailLink(string $token): string
    {
        return $this->frontendUrl.'/approve-mail?token='.$token;
    }
}
