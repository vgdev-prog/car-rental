CONSOLE = php bin/console
PHPSTAN = vendor/bin/phpstan
DEPTRAC = vendor/bin/deptrac

## Docker
up: ## Start all containers
	docker volume create booking_shared-sessions 2>/dev/null || true
	cd .docker && docker compose up -d --build

down: ## Stop all containers
	cd .docker && docker compose down

restart: ## Restart all containers
	cd .docker && docker compose down && docker compose up -d

## Symfony
cc: ## Clear cache
	$(CONSOLE) cache:clear

## Quality
phpstan: ## Run static analysis
	$(PHPSTAN) analyse

deptrac: deptrac-layers deptrac-modules ## Run all architecture boundary checks

deptrac-layers: ## Check Domain/Application/Infrastructure layering
	$(DEPTRAC) analyse --config-file=deptrac.layers.yaml

deptrac-modules: ## Check module isolation (feature modules use only Common)
	$(DEPTRAC) analyse --config-file=deptrac.modules.yaml

## Database
db-diff: ## Generate migration from entity diff
	$(CONSOLE) doctrine:migrations:diff

db-up: ## Execute specific migration up (usage: make db-up V=Version20260320120000)
	$(CONSOLE) doctrine:migrations:execute 'DoctrineMigrations\$(basename $(V))' --up --no-interaction

db-down: ## Rollback specific migration (usage: make db-down V=Version20260320120000)
	$(CONSOLE) doctrine:migrations:execute 'DoctrineMigrations\$(basename $(V))' --down --no-interaction

db-migrate: ## Run all pending migrations
	$(CONSOLE) doctrine:migrations:migrate --no-interaction

db-status: ## Show migrations status
	$(CONSOLE) doctrine:migrations:status

## Generate
entity: ## Make module entity (interactive)
	$(CONSOLE) make:module:entity

## Utility
sc: ## Symfony console (usage: m sc app:migrate:cars)
	$(CONSOLE) $(filter-out $@,$(MAKECMDGOALS))

%:
	@: