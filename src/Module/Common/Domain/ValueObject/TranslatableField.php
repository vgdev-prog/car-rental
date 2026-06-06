<?php

namespace App\Module\Common\Domain\ValueObject;

use App\Module\Common\Domain\Enum\Locale;
use JsonSerializable;

class TranslatableField implements JsonSerializable
{
    public function __construct(
        private array $translations = [],
    )
    {
    }

    public function get(string $locale): ?string
    {
        $fallback = Locale::ENGLISH->value;
        $locale = Locale::from($locale);

        return $this->translations[$locale->value]
            ?? $this->translations[$fallback]
            ?? null;
    }

    public function set(Locale $locale, mixed $value): self
    {
        return new self([...$this->translations, $locale->value => $value]);
    }

    public function all(): array
    {
        return $this->translations;
    }

    public static function fromArray(?array $data): self
    {
        return new self($data ?? []);
    }

    public function jsonSerialize(): mixed
    {
        return $this->translations;
    }
}
