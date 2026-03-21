<?php

declare(strict_types=1);

namespace App\Module\Car\Infrastructure\Console;

use App\Module\Car\Domain\Entity\Car;
use App\Module\Car\Domain\Enum\CarStatus;
use App\Module\Common\Domain\Enum\Locale;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:import:cars',
    description: 'Import cars from legacy MySQL to PostgreSQL',
)]
class ImportCarsCommand extends Command
{
    public function __construct(
        private Connection $legacyConnection,
        private EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $sql = <<<SQL
            SELECT
              t1.*,
              make_en.content as make_en,
              make_fr.content as make_fr,
              model_en.content as model_en,
              model_fr.content as model_fr
            FROM car_rental_cars t1
            LEFT JOIN car_rental_multi_lang make_en
              ON make_en.foreign_id = t1.id
              AND make_en.model = 'pjCar'
              AND make_en.field = 'make'
              AND make_en.locale = 1
            LEFT JOIN car_rental_multi_lang make_fr
              ON make_fr.foreign_id = t1.id
              AND make_fr.model = 'pjCar'
              AND make_fr.field = 'make'
              AND make_fr.locale = 2
            LEFT JOIN car_rental_multi_lang model_en
              ON model_en.foreign_id = t1.id
              AND model_en.model = 'pjCar'
              AND model_en.field = 'model'
              AND model_en.locale = 1
            LEFT JOIN car_rental_multi_lang model_fr
              ON model_fr.foreign_id = t1.id
              AND model_fr.model = 'pjCar'
              AND model_fr.field = 'model'
              AND model_fr.locale = 2

        SQL;

        $rows = $this->legacyConnection->fetchAllAssociative($sql);
        $cars = [];

        foreach ($rows as $row) {
            $car = new Car();
            $car->setStatus($row['status'] === "T" ? CarStatus::ACTIVE: CarStatus::INACTIVE);
            $car->setGas($row['gas'] ?? 0);
            $car->setRegistrationNumber($row['registration_number']);
            $car->setMileage($row['mileage'] ?? 0);
            $car->setVin($row['vin']);
            $car->setRegistrationCompany($row['company_reg']);
            $car->setLeasingCompany($row['company_finance']);
            $car->setInsuranceDocument($row['insurance_paper']);
            $car->setRegistrationDocument($row['registration']);
            $car->setBrand(Locale::ENGLISH, $row['make_en']);
            $car->setBrand(Locale::FRENCH, $row['make_fr']);

            $this->entityManager->persist($car);

            $cars[] = $car;
        }

        $this->entityManager->flush();


        $io->success('Done');
        return Command::SUCCESS;
    }
}
