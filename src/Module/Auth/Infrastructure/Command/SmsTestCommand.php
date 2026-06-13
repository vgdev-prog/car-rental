<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Notifier\Message\SmsMessage;
use Symfony\Component\Notifier\TexterInterface;

#[AsCommand(name: 'app:sms_test', description: 'Hello PhpStorm')]
class SmsTestCommand
{
    public function __construct(
        private TexterInterface $texter,
    ) {
    }

    public function __invoke(SymfonyStyle $io): int
    {
        $sms = (new SmsMessage('+380635262415', 'Your Code: 412333'))
                ->transport('fakesms');

        $this->texter->send($sms);

        $io->info('Sms sent - check Maildev: http://localhost:10800');

        return Command::SUCCESS;
    }
}
