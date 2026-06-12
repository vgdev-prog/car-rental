<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Security;

use App\Module\Auth\Application\UseCase\ConfirmLoginByPhoneHandler;
use App\Module\Auth\Application\UseCase\Input\ConfirmByPhoneLoginCommand;
use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\Enum\ErrorCode;
use App\Module\Auth\Domain\Exception\UserNotFoundException;
use App\Module\Auth\Infrastructure\Request\ConfirmLoginByPhoneDTO;
use App\Module\Auth\Infrastructure\Resource\AuthenticatedResource;
use JsonException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\TooManyLoginAttemptsAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\CustomCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class LoginCodeAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly ConfirmLoginByPhoneHandler $confirmLoginByPhoneHandler,
    ) {
    }

    public const string URL_SUPPORT_PATH = '/api/v1/auth/login-confirm';

    public function supports(Request $request): ?bool
    {
        return Request::METHOD_POST === $request->getMethod() && self::URL_SUPPORT_PATH === $request->getPathInfo();
    }

    public function authenticate(Request $request): Passport
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            $data = [];
        }

        $context = ConfirmLoginByPhoneDTO::fromArray($data);

        $violations = $this->validator->validate($context);
        if (count($violations) > 0) {
            throw new ValidationFailedException($context, $violations);
        }

        return new Passport(
            new UserBadge($context->phone),
            new CustomCredentials(
                static fn (string $code, User $user) => $user->isValidCode($code),
                $context->code
            )
        );
    }

    /**
     * @throws UserNotFoundException
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return null;
        }

        if (!$user->getPhone()) {
            return null;
        }

        $context = new ConfirmByPhoneLoginCommand($user->getPhone());
        $data = $this->confirmLoginByPhoneHandler->handle($context);

        return new JsonResponse(AuthenticatedResource::make($data->session->getToken(), $data->expiresAt, $user));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        if ($exception instanceof TooManyLoginAttemptsAuthenticationException) {
            $minutes = (int) ($exception->getMessageData()['%minutes%'] ?? 1);

            return new JsonResponse(
                [
                    'error' => [
                        'code' => Response::HTTP_TOO_MANY_REQUESTS,
                        'error_code' => 'TOO_MANY_ATTEMPTS',
                        'message' => 'Too many login attempts. Try again later.',
                    ],
                ],
                Response::HTTP_TOO_MANY_REQUESTS,
                ['Retry-After' => $minutes * 60],
            );
        }

        return new JsonResponse(
            [
                'error' => [
                    'code' => Response::HTTP_UNAUTHORIZED,
                    'error_code' => ErrorCode::INVALID_CREDENTIALS,
                    'message' => 'Invalid credentials.',
                ],
            ],
            Response::HTTP_UNAUTHORIZED,
        );
    }
}
