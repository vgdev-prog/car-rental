<?php

declare(strict_types=1);

namespace App\Module\Common\Infrastructure\Service;

use App\Module\Common\Domain\Contract\SmsSenderInterface;
use Symfony\Component\DependencyInjection\Attribute\AsAlias;
use Symfony\Component\Notifier\Message\SmsMessage;
use Symfony\Component\Notifier\TexterInterface;

#[AsAlias(SmsSenderInterface::class)]
class SmsSenderService implements SmsSenderInterface
{
    public function __construct(
        private readonly TexterInterface $texter,
    ) {
    }

    public function send(string $phone, string $message): void
    {
        $sms = (new SmsMessage($phone, $message))
            ->transport('fakesms');

        $this->texter->send($sms);
    }
}
