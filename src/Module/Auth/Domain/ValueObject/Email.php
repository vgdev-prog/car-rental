<?php

declare(strict_types=1);

namespace App\Module\Auth\Domain\ValueObject;

use App\Module\Auth\Domain\Exception\InvalidMailFormatException;

use const FILTER_VALIDATE_EMAIL;

final class Email
{
    /**
     * @throws InvalidMailFormatException
     */
    public function __construct(
        private string $value,
    ) {
        if (!filter_var($this->value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidMailFormatException();
        }
    }

    public function equals(self $email): bool
    {
        return $email->value === $this->value;
    }

    public static function fromString(string $value): self
    {
        return new self($value);
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
