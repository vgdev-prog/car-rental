<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Request;

use App\Module\Auth\Application\UseCase\Input\ConfirmByPhoneLoginCommand;
use Symfony\Component\Validator\Constraints as Assert;

class ConfirmLoginByPhoneDTO
{
    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[Assert\Length(min: 10, max: 255)]
    public string $phone;

    #[Assert\NotBlank]
    #[Assert\Type('string')]
    public string $code;

    public static function fromArray(array $data): self
    {
        $resource = new self();
        $resource->phone = $data['phone'] ?? null;
        $resource->code = $data['code'] ?? null;

        return $resource;
    }

    public function toCommand(): ConfirmByPhoneLoginCommand
    {
        return new ConfirmByPhoneLoginCommand(
            $this->phone,
        );
    }
}
