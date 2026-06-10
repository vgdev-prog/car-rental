<?php

declare(strict_types=1);


namespace App\Module\Auth\Application\UseCase\Input;

use App\Module\Common\Domain\Contract\CommandInterface;

class LoginByPhoneCommand implements CommandInterface
{
public string $phone;
}
