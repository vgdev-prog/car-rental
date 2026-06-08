<?php

declare(strict_types=1);


namespace App\Module\Common\Domain\Exception;

use App\Module\Common\Domain\Enum\ErrorCode;

class ResourceNotFoundException extends \Exception
{
    final public static function getStatusCode(): int
    {
        return 404;
    }

    public static function getDomainErrorCode(): string
    {
        return ErrorCode::NOT_FOUND->value;
    }


    /**
     * Array with helpful data that will be passed to response
     *
     * @return array<string, mixed>
     */
    public function getPublicContext(): array
    {
        return [];
    }

    /**
     * Example of public context for API documentation
     *
     * @return array<string, mixed>
     */
    public static function getExamplePublicContext(): array
    {
        return [];
    }
}
