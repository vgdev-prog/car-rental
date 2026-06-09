<?php

namespace App\Module\Auth\Infrastructure\Security;

use App\Module\Auth\Application\UseCase\Input\LoginByMailCommand;
use App\Module\Auth\Application\UseCase\LoginByMailHandler;
use App\Module\Auth\Domain\Entity\Session;
use App\Module\Auth\Domain\Exception\InvalidAuthCredentials;
use App\Module\Auth\Domain\Exception\UserNotFoundException;
use App\Module\Auth\Infrastructure\Repository\UserRepository;
use App\Module\Auth\Infrastructure\Request\LoginUserByMailDTO;
use App\Module\Auth\Infrastructure\Resource\AuthenticatedResource;
use App\Module\Common\Infrastructure\Service\RandomTokenGeneratorGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Clock\ClockInterface;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ApiAuthenticator extends AbstractAuthenticator
{
    public const URL_SUPPORT_PATH = '/api/v1/auth/login';
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly LoginByMailHandler $loginByMailHandler,
    )
    {
    }

    public function supports(Request $request): ?bool
    {
        return $request->getMethod() === Request::METHOD_POST && $request->getPathInfo() === self::URL_SUPPORT_PATH;
    }

    public function authenticate(Request $request): Passport
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            $data = [];
        }
        $context = LoginUserByMailDTO::fromArray($data);

        $violations = $this->validator->validate($context);
        if (count($violations) > 0) {
            throw new ValidationFailedException($context, $violations);
        }

        return new Passport(
            new UserBadge($data['email']),
            new PasswordCredentials($data['password'])
        );
    }

    /**
     * @throws UserNotFoundException
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $user = $token->getUser();

        $context = new LoginByMailCommand($user->getEmail());
        $data = $this->loginByMailHandler->handle($context);

        return new JsonResponse(AuthenticatedResource::make($data->session->getToken(),$data->expiresAt,$user));

    }

    /**
     * @throws InvalidAuthCredentials
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        throw new InvalidAuthCredentials();
    }
}
