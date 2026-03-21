<?php

namespace App\Module\Common\Infrastructure\Doctrine;

use App\Module\Common\Domain\ValueObject\TranslatableField;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\JsonType;

class TranslatableFieldType extends JsonType
{
    public const name = 'translatable_field';

    public function convertToPHPValue($value, AbstractPlatform $platform): TranslatableField
    {
        $data = parent::convertToPHPValue($value, $platform);
        return TranslatableField::fromArray($data);
    }

    public function convertToDatabaseValue($value, $platform): ?string
    {
        if ($value instanceof TranslatableField) {
            $value = $value->all();
        }

        return parent::convertToDatabaseValue($value, $platform);
    }

    public function getName(): string
    {
        return self::name;
    }
}
