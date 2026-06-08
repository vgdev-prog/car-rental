<?php

declare(strict_types=1);

namespace App\Module\Auth\Infrastructure\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    #[Route('/login', name: 'login')]
    public function loginByMail(): Response
    {
return new Response('Authorization');
    }
}
