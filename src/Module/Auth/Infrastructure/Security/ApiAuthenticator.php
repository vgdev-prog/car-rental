<?php

namespace App\Module\Auth\Infrastructure\Security;

use App\Module\Auth\Domain\Exception\InvalidAuthCredentials;
use App\Module\Auth\Infrastructure\Request\LoginUserByMailDTO;
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
    public function __construct(
        private ValidatorInterface $validator,
    )
    {
    }

    public function supports(Request $request): ?bool
    {
        return $request->getMethod() === Request::METHOD_POST && $request->getPathInfo() === '/api/v1/auth/login';
    }

    public function authenticate(Request $request): Passport
    {
        try {
            $data = $request->toArray();
        } catch (\Symfony\Component\HttpFoundation\Exception\JsonException) {
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

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {

    }

    /**
     * @throws InvalidAuthCredentials
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        throw new InvalidAuthCredentials();
    }

    //    public function start(Request $request, ?AuthenticationException $authException = null): Response
    //    {
    //        /*
    //         * If you would like this class to control what happens when an anonymous user accesses a
    //         * protected page (e.g. redirect to /login), uncomment this method and make this class
    //         * implement Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface.
    //         *
    //         * For more details, see https://symfony.com/doc/current/security/experimental_authenticators.html#configuring-the-authentication-entry-point
    //         */
    //    }
}
