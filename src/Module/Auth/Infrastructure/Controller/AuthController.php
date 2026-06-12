<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Controller;

use App\Module\Auth\Application\UseCase\ConfirmOAuthUrlHandler;
use App\Module\Auth\Application\UseCase\GenerateOAuthUrlHandler;
use App\Module\Auth\Application\UseCase\Input\ConfirmLoginOAuthCommand;
use App\Module\Auth\Application\UseCase\LoginByPhoneHandler;
use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Domain\Enum\OAuthProvider;
use App\Module\Auth\Domain\Repository\UserRepositoryInterface;
use App\Module\Auth\Infrastructure\Request\LoginUserByPhoneDTO;
use App\Module\Auth\Infrastructure\Request\OAuthConfirmLoginDTO;
use App\Module\Auth\Infrastructure\Resource\CodeSendResource;
use App\Module\Auth\Infrastructure\Resource\UserResource;
use Psr\Cache\CacheItemPoolInterface;
use Psr\Cache\InvalidArgumentException;
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
        private readonly UserRepositoryInterface $userRepository,
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

    #[Route('/oauth/{provider}/url', name: 'oauth-google', methods: ['GET'])]
    public function authByGoogleOAuth(string $provider, GenerateOAuthUrlHandler $handler): JsonResponse
    {
        $provider = OAuthProvider::tryFrom($provider);
        $state = bin2hex(random_bytes(16));
        $item = $this->oauthState->getItem('oauth_state_'.$state);
        $item->set(true);
        $this->oauthState->save($item);

        return new JsonResponse([
            'url' => $handler->handle($provider, $state),
        ]);
    }

    /**
     * @throws InvalidArgumentException
     */
    #[Route('/oauth/{provider}/confirm', name: 'oauth-google-validate', methods: ['POST'])]
    public function validateAuthGoogle(
        #[MapRequestPayload] OAuthConfirmLoginDTO $dto,
        OAuthProvider $provider,
        ConfirmOAuthUrlHandler $handler,
    ): JsonResponse {
        $key = 'oauth_state_'.$dto->state;
        $item = $this->oauthState->getItem($key);

        if (!$item->isHit()) {
            return new JsonResponse(['error' => 'invalid_state'], Response::HTTP_UNAUTHORIZED);
        }

        $this->oauthState->deleteItem($key);

        $context = new ConfirmLoginOAuthCommand($dto->code, $provider);
        $handler->handle($context);

        return new JsonResponse([
            'data' => '',
        ]);
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function authUser(#[CurrentUser] User $user): JsonResponse
    {
        return new JsonResponse([
            'user' => UserResource::make($user),
            'message' => 'You are logged in',
        ]);
    }
}
