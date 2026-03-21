<?php

namespace App\Module\Car\Infrastructure\Http\Resource;

use App\Module\Car\Domain\Entity\Car;
use App\Module\Common\Domain\Enum\Locale;

class CarSelectItem
{
    private function __construct()
    {
    }

    public readonly int $id;
    public readonly ?string $brand;
    public readonly ?string $model;
    public readonly ?string $registration_number;


    public static function make(Car $car, Locale $locale): self
    {
        $resource = new self();
        $resource->id = $car->getId();
        $resource->brand = $car->getBrand($locale);
        $resource->model = $car->getModel($locale);
        $resource->registration_number = $car->getRegistrationNumber();
        return $resource;
    }

    public static function makeFromCollection(array $cars, Locale $locale): array
    {
        return array_map(fn ($car) => self::make($car, $locale), $cars);
    }
}
