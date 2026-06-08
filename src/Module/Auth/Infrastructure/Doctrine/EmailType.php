<?php

declare(strict_types=1);


namespace App\Module\Auth\Infrastructure\Doctrine;

use App\Module\Auth\Domain\ValueObject\Email;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;

final class EmailType extends StringType
{
    public const NAME = 'email';

    public function convertToPHPValue($value, AbstractPlatform $platform): ?Email
    {
        if ($value === null) {
            return null;
        }

       return Email::fromString($value);
    }

    public function convertToDatabaseValue(mixed $value, AbstractPlatform $platform): ?string
    {
        if ($value === null) {
            return null;
        }
        return (string) $value;
    }

    public function getName(): string
    {
        return self::NAME;
    }
}
