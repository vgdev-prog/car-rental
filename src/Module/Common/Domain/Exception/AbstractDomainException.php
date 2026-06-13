<?php

declare(strict_types=1);

namespace App\Module\Common\Domain\Exception;

use Exception;

abstract class AbstractDomainException extends Exception
{
    final public static function getStatusCode(): int
    {
        return 400;
    }

    /**
     * Return domain error code for identifying and handling errors in API clients
     * Example:
     * AUTH_INCORRECT_EMAIL_OR_PASSWORD.
     */
    abstract public static function getDomainErrorCode(): string;

    /**
     * Array with helpful data that will be passed to response.
     *
     * @return array<string, mixed>
     */
    public function getPublicContext(): array
    {
        return [];
    }

    /**
     * Example of public context for API documentation.
     *
     * @return array<string, mixed>
     */
    public static function getExamplePublicContext(): array
    {
        return [];
    }
}
