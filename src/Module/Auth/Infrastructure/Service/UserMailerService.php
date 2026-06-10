<?php

declare(strict_types=1);


namespace App\Module\Auth\Infrastructure\Service;

use App\Module\Auth\Application\Service\FrontEndLinkBuilder;
use App\Module\Auth\Domain\Contracts\UserMailerInterface;
use App\Module\Auth\Domain\ValueObject\Email;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\DependencyInjection\Attribute\AsAlias;
use Symfony\Component\Mailer\MailerInterface;

#[AsAlias(UserMailerInterface::class)]
class UserMailerService implements UserMailerInterface
{
    public function __construct(
        private string              $senderMail,
        private MailerInterface     $mailer,
        private FrontEndLinkBuilder $frontLinkBuilder,
    )
    {
    }

    public function sendWelcomeMail(Email $email, string $token): void
    {
        $url = $this->frontLinkBuilder->approveMailLink($token);

        $message = (new TemplatedEmail())
            ->from($this->senderMail)
            ->to((string)$email)
            ->subject('Welcome to ' . $this->senderMail)
            ->htmlTemplate('@Auth/mail/welcome.html.twig')
            ->context([
                'confirmationUrl' => $url,
            ]);

        $this->mailer->send($message);

    }
}
