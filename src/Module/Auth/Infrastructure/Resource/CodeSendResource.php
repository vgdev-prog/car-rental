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
        $resource->phone = $resource->mask($user->getPhone());
        $resource->expiresIn = 600;

        return $resource;
    }

    private function mask(string $phone): string
    {
        $head = mb_substr($phone, 0, 4);
        $tail = mb_substr($phone, -2);
        $hidden = max(0, mb_strlen($phone) - 6);

        return $head . str_repeat('•', $hidden) . $tail;

    }
}
