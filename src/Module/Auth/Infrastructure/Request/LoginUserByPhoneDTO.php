<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Request;

use App\Module\Auth\Application\UseCase\Input\LoginByPhoneCommand;
use App\Module\Common\Domain\Contract\RequestInterface;
use Symfony\Component\Validator\Constraints as Assert;

class LoginUserByPhoneDTO implements RequestInterface
{
    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[Assert\Length(min: 10, max: 255)]
    public string $phone;

    public function toCommand(): LoginByPhoneCommand
    {
        $command = new LoginByPhoneCommand();
        $command->phone = $this->phone;

        return $command;
    }
}
