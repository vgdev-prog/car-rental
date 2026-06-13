<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Controller;

use App\Module\Auth\Application\UseCase\ConfirmOAuthUrlHandler;
use App\Module\Auth\Application\UseCase\GenerateOAuthUrlHandler;
use App\Module\Auth\Application\UseCase\Input\ConfirmLoginOAuthCommand;
use App\Module\Auth\Application\UseCase\LoginByPhoneHandler;
use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\Enum\OAuthProvider;
use App\Module\Auth\Domain\Exception\EmailAlreadyApprovedException;
use App\Module\Auth\Domain\Exception\InvalidOAuthStateException;
use App\Module\Auth\Infrastructure\Request\LoginUserByPhoneDTO;
use App\Module\Auth\Infrastructure\Request\OAuthConfirmLoginDTO;
use App\Module\Auth\Infrastructure\Resource\AuthenticatedResource;
use App\Module\Auth\Infrastructure\Resource\CodeSendResource;
use App\Module\Auth\Infrastructure\Resource\UserResource;
use Psr\Cache\CacheItemPoolInterface;
use Psr\Cache\InvalidArgumentException;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Random\RandomException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class AuthController extends AbstractController
{
    public function __construct(
        private readonly CacheItemPoolInterface $oauthState,
    ) {
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function loginByMail(): Response
    {
        return new Response('Authorization');
    }

    #[Route('/login-by-phone', name: 'login-by-phone', methods: ['POST'])]
    public function loginByPhone(#[MapRequestPayload] LoginUserByPhoneDTO $request, LoginByPhoneHandler $handler): JsonResponse
    {
        $context = $request->toCommand();
        $user = $handler->handle($context);

        return new JsonResponse(CodeSendResource::make($user));
    }

    #[Route('/login-confirm', name: 'login-confirm', methods: ['POST'])]
    public function confirmAuthByPhone(): void
    {
    }

    /**
     * @throws RandomException
     * @throws InvalidArgumentException
     */
    #[Route('/oauth/{provider}/url', name: 'oauth-google', methods: ['GET'])]
    public function generateOAuthUrl(string $provider, GenerateOAuthUrlHandler $handler): JsonResponse
    {
        $oAuthProvider = OAuthProvider::tryFrom($provider);

        $state = bin2hex(random_bytes(16));
        $key = 'oauth_state_'.$state;

        $item = $this->oauthState->getItem($key);
        $item->set(true);
        $this->oauthState->save($item);

        return new JsonResponse([
            'url' => $handler->handle($oAuthProvider, $state),
        ]);
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws InvalidArgumentException
     * @throws InvalidOAuthStateException
     * @throws EmailAlreadyApprovedException
     */
    #[Route('/oauth/{provider}/confirm', name: 'oauth-google-validate', methods: ['POST'])]
    public function confirmOAuth(
        #[MapRequestPayload] OAuthConfirmLoginDTO $dto,
        OAuthProvider $provider,
        ConfirmOAuthUrlHandler $handler,
    ): JsonResponse {
        $key = 'oauth_state_'.$dto->state;
        $item = $this->oauthState->getItem($key);

        if (!$item->isHit()) {
            throw new InvalidOAuthStateException($item->getKey());
        }

        $this->oauthState->deleteItem($key);

        $context = new ConfirmLoginOAuthCommand($dto->code, $provider);
        $issue = $handler->handle($context);

        return new JsonResponse(
            AuthenticatedResource::make(
                token: $issue->session->getToken(),
                expiresAt: $issue->expiresAt,
                user: $issue->session->getUser())
        );
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function authUser(#[CurrentUser] User $user): JsonResponse
    {
        return new JsonResponse([
            'user' => UserResource::make($user),
        ]);
    }
}
