<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Request;

use App\Module\Auth\Application\UseCase\Input\ConfirmLoginOAuthCommand;
use Symfony\Component\Validator\Constraints as Assert;

class OAuthConfirmLoginDTO
{
    #[Assert\NotBlank]
    #[Assert\Type('string')]
    public string $code;

    #[Assert\NotBlank]
    #[Assert\Type('string')]
    public string $state;

    public function toCommand(): ConfirmLoginOAuthCommand
    {
        $command = new ConfirmLoginOAuthCommand();
        $command->code = $this->code;

        return $command;
    }
}
