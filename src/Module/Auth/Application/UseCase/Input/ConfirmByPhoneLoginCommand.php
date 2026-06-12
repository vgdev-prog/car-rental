<?php

declare(strict_types=1);

namespace App\Module\Auth\Application\UseCase\Input;

class ConfirmByPhoneLoginCommand
{
    public function __construct(
        public string $phone,
    ) {
    }
}
