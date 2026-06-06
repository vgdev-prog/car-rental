<?php

namespace App\Module\Common\Application\Service;

use App\Module\Common\Domain\Enum\Locale;
use Symfony\Component\HttpFoundation\Request;

class RequestHelper
{
    public static function extractLocale(Request $request): Locale
    {
        return Locale::from($request->getLocale());
    }
}
