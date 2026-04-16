up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

migrate:
	docker compose exec backend php artisan migrate

seed:
	docker compose exec backend php artisan db:seed

fresh:
	docker compose exec backend php artisan migrate:fresh --seed

shell:
	docker compose exec backend sh

logs:
	docker compose logs -f backend

test:
	docker compose exec backend php artisan test

npm-install:
	docker compose exec frontend npm install

tinker:
	docker compose exec backend php artisan tinker
