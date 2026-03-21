<?php

namespace App\Module\Car\Domain\Entity;

use App\Module\Car\Domain\Enum\CarStatus;
use App\Module\Car\Infrastructure\Repository\CarRepository;
use App\Module\Common\Domain\Enum\Locale;
use App\Module\Common\Domain\ValueObject\TranslatableField;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CarRepository::class)]
#[ORM\Table(name: 'car_cars')]
class Car
{
    public function __construct()
    {
        $this->brand = new TranslatableField();
        $this->model = new TranslatableField();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'translatable_field', length: 255)]
    private ?TranslatableField $brand = null;

    #[ORM\Column(type: 'translatable_field', length: 255)]
    private ?TranslatableField $model = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $registration_number = null;

    #[ORM\Column(length: 255)]
    private int $mileage;

    #[ORM\Column(length: 255)]
    private int $gas;

    #[ORM\Column(length: 255)]
    private CarStatus $status;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $vin = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $registration_company = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $leasing_company = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $gps = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $registration_document = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $insurance_document = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRegistrationNumber(): ?string
    {
        return $this->registration_number;
    }

    public function setRegistrationNumber(string $registration_number): static
    {
        $this->registration_number = $registration_number;

        return $this;
    }

    public function getMileage(): int
    {
        return $this->mileage;
    }

    public function setMileage(int $mileage): static
    {
        $this->mileage = $mileage;

        return $this;
    }

    public function getGas(): int
    {
        return $this->gas;
    }

    public function setGas(int $gas): static
    {
        $this->gas = $gas;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status->value;
    }

    public function setStatus(CarStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getVin(): ?string
    {
        return $this->vin;
    }

    public function setVin(?string $vin): static
    {
        $this->vin = $vin;

        return $this;
    }

    public function getRegistrationCompany(): ?string
    {
        return $this->registration_company;
    }

    public function setRegistrationCompany(?string $registration_company): static
    {
        $this->registration_company = $registration_company;

        return $this;
    }

    public function getLeasingCompany(): ?string
    {
        return $this->leasing_company;
    }

    public function setLeasingCompany(?string $leasing_company): static
    {
        $this->leasing_company = $leasing_company;

        return $this;
    }

    public function getGps(): ?string
    {
        return $this->gps;
    }

    public function setGps(?string $gps): static
    {
        $this->gps = $gps;

        return $this;
    }

    public function getRegistrationDocument(): ?string
    {
        return $this->registration_document;
    }

    public function setRegistrationDocument(?string $registration_document): static
    {
        $this->registration_document = $registration_document;

        return $this;
    }

    public function getInsuranceDocument(): ?string
    {
        return $this->insurance_document;
    }

    public function setInsuranceDocument(?string $insurance_document): static
    {
        $this->insurance_document = $insurance_document;

        return $this;
    }

    public function getBrand(Locale $locale): ?string
    {
        return $this->brand->get($locale->value);
    }

    public function setBrand(Locale $locale, ?string $value): void
    {
        $this->brand = $this->brand->set($locale, $value);
    }

    public function getModel(Locale $locale): ?string
    {
        return $this->model->get($locale->value);
    }

    public function setModel(Locale $locale, ?string $value): void
    {
        $this->model = $this->model->set($locale, $value);
    }


}
