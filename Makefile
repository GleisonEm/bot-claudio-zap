up:
	docker-compose -f composeConfigAll.yml up -d
up2:
	docker-compose up
up3:
	docker-compose -f docker-compose2.yml up -d
build:
	docker build . -t gleisin/node-bot-zap -f docker/Dockerfile
buildUp:
	docker build . -t gleisin/node-bot-zap -f docker/Dockerfile
	docker-compose up
