<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Controller;

use App\Module\Auth\Application\UseCase\LoginByPhoneHandler;
use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Infrastructure\Request\LoginUserByPhoneDTO;
use App\Module\Auth\Infrastructure\Resource\CodeSendResource;
use App\Module\Auth\Infrastructure\Resource\UserResource;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class AuthController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function loginByMail(): Response
    {
        return new Response('Authorization');
    }

    #[Route("/login-by-phone", name: 'login-by-phone', methods: ['POST'])]
    public function loginByPhone(#[MapRequestPayload] LoginUserByPhoneDTO $request, LoginByPhoneHandler $handler): JsonResponse
    {
        $context = $request->toCommand();
        $user = $handler->handle($context);

        return new JsonResponse(CodeSendResource::make($user));

    }

    #[Route("/me", name: 'me', methods: ['GET'])]
    public function authUser(#[CurrentUser] User $user): JsonResponse
    {
        return new JsonResponse([
            'user' => UserResource::make($user),
            'message' => 'You are logged in'
        ]);
    }
}
