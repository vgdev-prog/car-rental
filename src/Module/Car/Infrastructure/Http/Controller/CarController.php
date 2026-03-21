<?php

declare(strict_types=1);

namespace App\Module\Car\Infrastructure\Http\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/maintenance', name: 'maintenance.')]
class CarController extends AbstractController
{
    #[Route('/car',methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('car/index.html.twig');
    }
}
