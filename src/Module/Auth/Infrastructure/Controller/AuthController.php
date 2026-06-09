<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Controller;

use App\Module\Auth\Domain\Entity\User;
use App\Module\Auth\Infrastructure\Resource\UserResource;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class AuthController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function loginByMail(): Response
    {
return new Response('Authorization');
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
