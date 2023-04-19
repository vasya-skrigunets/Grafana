# Development commands
dev_start: ecr_login dev_build dev_up
stage_start: ecr_login stage_build stage_up
prod_start: ecr_login prod_build prod_up
pipeline_start: ecr_login dev_build dev_up

dev_hard_reboot: dev_down docker_clean_all dev_start dev_postgresql_restore dev_django_makemigrations dev_django_migrate_all dev_attach
pipeline_hard_reboot: dev_down docker_clean_all dev_start pipeline_postgresql_restore dev_django_makemigrations dev_django_migrate_all dev_attach
stage_hard_reboot: stage_down docker_clean_all_noconfirm stage_start stage_postgresql_restore stage_django_makemigrations stage_django_migrate_all

jenkins_hard_reboot: dev_down docker_clean_all_noconfirm dev_start dev_postgresql_restore dev_django_makemigrations dev_django_migrate_all dev_up

DEV_PG_USER = SKUdrop
DEV_PG_DATABASE = SKUdrop

dev_up:
	docker-compose -f docker-compose.dev.yml up -d

dev_stop:
	docker-compose -f docker-compose.dev.yml stop

dev_down:
	docker-compose -f docker-compose.dev.yml down

dev_build:
	docker-compose -f docker-compose.dev.yml build

dev_attach:
	docker-compose -f docker-compose.dev.yml up

dev_ps:
	docker-compose -f docker-compose.dev.yml ps

# Development django commands
dev_migrate_db: dev_django_makemigrations dev_django_migrate_all

dev_django_makemigrations:
	docker exec django_dev python manage.py makemigrations

dev_django_migrate_shared:
	docker exec -it django_dev python manage.py migrate_schemas --shared

dev_django_migrate_all:
	docker exec  django_dev python manage.py migrate_schemas

dev_django_collectstatic:
	docker exec -it django_dev python manage.py collectstatic

dev_django_shell:
	docker exec -it django_dev python manage.py shell

dev_django_tests:
	docker exec -it django_dev python manage.py test integrations
	docker exec -it django_dev python manage.py test rates
	docker exec -it django_dev python manage.py test amazon_mws
	docker exec -it django_dev python manage.py test shipments.tests1_public
	docker exec -it django_dev python manage.py test shipments.tests2_custom
	docker exec -it django_dev coverage run manage.py test affiliate_program
	docker exec -it django_dev coverage run manage.py test users
	docker exec -it django_dev coverage run manage.py test notifications
	docker exec -it django_dev coverage run manage.py test tenants
	docker exec -it django_dev coverage run manage.py test freight_forwarding
	docker exec -it django_dev coverage run manage.py test rates

dev_django_tests_coverage:
	docker exec -it django_dev coverage html apps/notifications/views.py
	docker exec -it django_dev coverage html --include=apps/tenants/* --omit='*/migrations/*.py'

dev_django_linux_shell:
	docker exec -it django_dev /bin/bash

dev_make_translation:
	docker exec -it django_dev python3 manage.py makemessages -l zh_Hans
	docker exec -it django_dev python3 manage.py compilemessages

dev_django_createsuperuser:
	docker exec -it django_dev python manage.py createsuperuser

dev_django_pylint:
	docker exec -e DJANGO_SETTINGS_MODULE='skudrop.settings' django_dev pylint --errors-only --load-plugins pylint_django ./apps --ignore-paths=./apps/notifications/consumers.py ./apps/amazon_mws/serializers.py

dev_django_bandit:
	bandit -r ./backend/apps --exclude ./backend/apps/tests/,./backend/apps/amazon_mws/jobs.py,./backend/apps/amazon_mws/tests.py,./backend/apps/integrations/tests.py,./backend/apps/payments/tests.py,./backend/apps/shipments/tests1_public.py,./backend/apps/shipments/tests2_custom.py,./backend/apps/users/tests1_public.py,./backend/apps/users/tests2_custom.py,./backend/apps/tenants/tests1_public.py,./backend/apps/tenants/tests2_custom.py,./backend/apps/amazon_mws/functions.py,./backend/apps/freight_forwarding/functions.py

# Development postgresql commands
dev_postgresql_dump:
	docker exec -t postgresql_dev pg_dumpall -c -U $(DEV_PG_DATABASE) | gzip > ./database/db_dump.sql.gz

dev_postgresql_restore:
	sleep 10
	gzip -d < ./database/db_dump.sql.gz | docker exec -i postgresql_dev psql -U $(DEV_PG_DATABASE) -d $(DEV_PG_USER)

dev_postgresql_shell:
	docker exec -it postgresql_dev psql -U $(DEV_PG_USER) -W $(DEV_PG_DATABASE)

stage_postgresql_shell:
	docker exec -it postgresql_stage psql -U $(DEV_PG_USER) -W $(DEV_PG_DATABASE)

prod_postgresql_shell:
	docker exec -it postgresql_prod psql -U $(DEV_PG_USER) -W $(DEV_PG_DATABASE)

# Staging commands
stage_up:
	docker-compose -f docker-compose.stage.yml up -d

stage_stop:
	docker-compose -f docker-compose.stage.yml stop

stage_down:
	docker-compose -f docker-compose.stage.yml down

stage_build:
	docker-compose -f docker-compose.stage.yml build

stage_attach:
	docker-compose -f docker-compose.stage.yml up

stage_ps:
	docker-compose -f docker-compose.stage.yml ps

# Staging django commands
stage_django_makemigrations:
	docker exec django_stage python manage.py makemigrations

stage_django_migrate_shared:
	docker exec django_stage python manage.py migrate_schemas --shared

stage_django_migrate_all:
	docker exec django_stage python manage.py migrate_schemas

stage_django_collectstatic:
	docker exec django_stage python manage.py collectstatic

stage_django_shell:
	docker exec django_stage python manage.py shell

stage_django_tests:
	docker exec django_stage python manage.py test integrations
	docker exec django_stage python manage.py test users
	docker exec django_stage python manage.py test tenants

stage_django_linux_shell:
	docker exec -it django_stage /bin/bash

stage_django_createsuperuser:
	docker exec -it django_stage python manage.py createsuperuser

stage_django_pylint:
	docker exec -e DJANGO_SETTINGS_MODULE='skudrop.settings' django_stage pylint --load-plugins pylint_django ./apps


# Staging postgresql commands
stage_postgresql_dump:
	docker exec -t postgresql_stage pg_dumpall -c -U $(DEV_PG_DATABASE) | gzip > ./database/db_dump.sql.gz

stage_postgresql_restore:
	gunzip < ./database/db_dump.sql.gz | docker exec -i postgresql_stage psql -U $(DEV_PG_DATABASE) -d $(DEV_PG_USER)


# Production commands
prod_up:
	docker-compose -f docker-compose.prod.yml up -d

prod_stop:
	docker-compose -f docker-compose.prod.yml stop

prod_down:
	docker-compose -f docker-compose.prod.yml down

prod_build:
	docker-compose -f docker-compose.prod.yml build

prod_attach:
	docker-compose -f docker-compose.prod.yml up

prod_ps:
	docker-compose -f docker-compose.prod.yml ps

# Production django commands
prod_django_makemigrations:
	docker exec -it django_prod python manage.py makemigrations

prod_django_migrate_shared:
	docker exec -it django_prod python manage.py migrate_schemas --shared

prod_django_migrate_all:
	docker exec -it django_prod python manage.py migrate_schemas

prod_django_collectstatic:
	docker exec -it django_prod python manage.py collectstatic

prod_django_shell:
	docker exec -it django_prod python manage.py shell

prod_django_tests:
	docker exec django_prod python manage.py test

prod_django_linux_shell:
	docker exec -it django_prod /bin/bash

prod_django_createsuperuser:
	docker exec -it django_prod python manage.py createsuperuser

prod_django_pylint:
	docker exec -e DJANGO_SETTINGS_MODULE='skudrop.settings' django_prod pylint --load-plugins pylint_django ./apps

# Production postgresql commands
prod_postgresql_dump:
	docker exec -t postgresql_prod pg_dumpall -c -U $(DEV_PG_DATABASE) | gzip > ./database/db_prod_dump.sql.gz

prod_postgresql_restore:
	gunzip < ./database/db_prod_dump.sql.gz | docker exec -i postgresql_prod psql -U $(DEV_PG_DATABASE) -d $(DEV_PG_USER)


# Common commands
docker_clean_all:
	docker system prune --all
	docker volume prune

docker_clean_all_noconfirm:
	docker system prune --all --force
	docker volume prune --force

clair_up:
	docker-compose -f clair/docker-compose.clair.yml up -d

clair_down:
	docker-compose -f clair/docker-compose.clair.yml down

clair_check_django:
	CLAIR_ADDR=127.0.0.1:6060 CLAIR_THRESHOLD=10 FORMAT_OUTPUT=json CLAIR_OUTPUT=High ./clair/klar python:3.10.0rc1-buster

clair_check_nginx:
	CLAIR_ADDR=127.0.0.1:6060 CLAIR_THRESHOLD=10 FORMAT_OUTPUT=json CLAIR_OUTPUT=High ./clair/klar nginx:1.21.3-alpine

clair_check_postgresql:
	CLAIR_ADDR=127.0.0.1:6060 CLAIR_THRESHOLD=10 FORMAT_OUTPUT=json CLAIR_OUTPUT=High ./clair/klar postgres:13.4-alpine

clair_check_react:
	CLAIR_ADDR=127.0.0.1:6060 CLAIR_THRESHOLD=10 FORMAT_OUTPUT=json CLAIR_OUTPUT=High ./clair/klar node:16-alpine3.12


# Pipelines commands
pipeline_up: ecr_login
	docker-compose -f docker-compose.pipeline.yml up -d --force-recreate

pipeline_postgresql_restore:
	sleep 10
	gunzip < ./database/test_db_dump.sql.gz | docker exec -i postgresql_dev psql -U $(DEV_PG_DATABASE) -d $(DEV_PG_USER)

pipeline_postgresql_dump:
	docker exec -t postgresql_dev pg_dumpall -c -U $(DEV_PG_DATABASE) | gzip > ./database/test_db_dump.sql.gz

pipeline_django_makemigrations:
	docker exec django_dev python manage.py makemigrations

pipeline_django_migrate_shared:
	docker exec django_dev python manage.py migrate_schemas --shared

pipeline_django_migrate_all:
	docker exec django_dev python manage.py migrate_schemas

pipeline_django_tests:
	docker exec django_dev python manage.py test integrations
	docker exec django_dev python manage.py test rates
	docker exec django_dev python manage.py test amazon_mws
	docker exec django_dev python manage.py test tenants
	docker exec django_dev python manage.py test shipments.tests1_public
	docker exec django_dev python manage.py test shipments.tests2_custom
	docker exec django_dev coverage run manage.py test affiliate_program
	docker exec django_dev coverage run manage.py test users


pipeline_down:
	docker-compose -f docker-compose.pipeline.yml down

black_format:
	docker exec django_dev black ./ --exclude migrations

black_check:
	docker exec django_dev black ./ --exclude migrations --check

isort_format:
	docker exec django_dev isort apps

isort_check:
	docker exec django_dev isort apps --check-only

lint_format: isort_format black_format

lint_check: isort_check black_check

ecr_login:
	aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 637224464501.dkr.ecr.eu-central-1.amazonaws.com
