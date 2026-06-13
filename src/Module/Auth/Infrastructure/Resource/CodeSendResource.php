<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Resource;

use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\Enum\Channel;
use App\Module\Auth\Domain\Enum\SendStatus;

class CodeSendResource
{
    public SendStatus $status;
    public string $message;
    public Channel $channel;
    public string $phone;
    public int $expiresIn;

    public static function make(User $user): self
    {
        $resource = new self();
        $resource->status = SendStatus::SEND;
        $resource->message = 'We sent a verification code to your phone.';
        $resource->channel = Channel::PHONE;
        $resource->phone = $user->maskPhone();
        $resource->expiresIn = 600;

        return $resource;
    }
}
