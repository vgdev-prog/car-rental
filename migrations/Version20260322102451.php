<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260322102451 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add created_at and updated_at timestamps to car_cars, maintenance and maintenance_category tables';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE car_cars ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE car_cars ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE maintenance ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE maintenance ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE maintenance_category ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE maintenance_category ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE car_cars DROP created_at');
        $this->addSql('ALTER TABLE car_cars DROP updated_at');
        $this->addSql('ALTER TABLE maintenance DROP created_at');
        $this->addSql('ALTER TABLE maintenance DROP updated_at');
        $this->addSql('ALTER TABLE maintenance_category DROP created_at');
        $this->addSql('ALTER TABLE maintenance_category DROP updated_at');
    }
}
