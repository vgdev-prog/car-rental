CONSOLE = php bin/console
PHPSTAN = vendor/bin/phpstan
DEPTRAC = vendor/bin/deptrac
CSFIXER = vendor/bin/php-cs-fixer


cc: ## Clear cache
	$(CONSOLE) cache:clear

## Quality
phpstan: ## Run static analysis
	$(PHPSTAN) analyse

cs: ## Check coding standards (no changes)
	$(CSFIXER) fix --dry-run --diff

cs-fix: ## Fix coding standards
	$(CSFIXER) fix

deptrac: deptrac-layers deptrac-modules ## Run all architecture boundary checks

deptrac-layers: ## Check Domain/Application/Infrastructure layering
	$(DEPTRAC) analyse --config-file=deptrac.layers.yaml

deptrac-modules: ## Check module isolation (feature modules use only Common)
	$(DEPTRAC) analyse --config-file=deptrac.modules.yaml

db-status: ## Show migrations status
	$(CONSOLE) doctrine:migrations:status

## Generate
entity: ## Make module entity (interactive)
	$(CONSOLE) make:module:entity

%:
	@:
