<?php

namespace App\Module\Car\Infrastructure\Http\Controller;

use App\Module\Car\Domain\Repository\CarRepositoryInterface;
use App\Module\Car\Infrastructure\Http\Resource\CarSelectItem;
use App\Module\Common\Domain\Enum\Locale;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/maintenance', name: 'maintenance.')]
class MaintenanceController extends AbstractController
{
    #[Route('', name: 'index')]
    public function index(CarRepositoryInterface $carRepository, Request $request): Response
    {
        $locale = Locale::from($request->getLocale());
        $cars = $carRepository->findAll();

        $cars = CarSelectItem::makeFromCollection($cars, $locale);
        return $this->render('maintenance/index.html.twig', compact('cars', 'locale'));
    }

    #[Route('/damage', name: 'damage')]
    public function damage(): Response
    {
        return $this->render('maintenance/damage.html.twig', [
            'current_tab' => 'damage',
        ]);
    }

    #[Route('/location-history', name: 'location_history')]
    public function locationHistory(): Response
    {
        return $this->render('maintenance/location-history.html.twig', [
            'current_tab' => 'history',
        ]);
    }
}
