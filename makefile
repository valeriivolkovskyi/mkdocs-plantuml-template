IMAGE_DEV=docs-dev
IMAGE_BUILDER=docs-builder

.PHONY: dev site clean

## Run local dev server with live reload
start:
	docker build -t $(IMAGE_DEV) --target dev .
	docker run --rm -it -p 8000:8000 -v "$$PWD":/docs $(IMAGE_DEV)

## Build docs and extract ./site
build:
	docker build -t $(IMAGE_BUILDER) --target builder .
	@CID=$$(docker create $(IMAGE_BUILDER)); \
	mkdir -p site; \
	docker cp $$CID:/out ./site; \
	docker rm $$CID

## Remove build artifacts and images
clean:
	rm -rf site
	-docker rmi $(IMAGE_DEV) $(IMAGE_BUILDER) || true
