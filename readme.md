# Documentation Site Setup

This project uses **MkDocs** with the **Material theme** and the `plantuml_markdown` extension to generate documentation.  
The output is a static site that can be served from **S3 + CloudFront** in production.  
UML diagrams are rendered locally with the PlantUML JAR inside the container.

---

## Local Development

Run MkDocs with live reload and automatic rebuilds.

```bash
# Build the dev image
docker build -t docs-dev --target dev .
```
```bash
# Run with your source mounted
docker run --rm -it -p 8000:8000 -v "$PWD":/docs docs-dev
# Access docs at:
# http://localhost:8000s
```

## Production Build
```bash
``# Build the production image
docker build -t docs-builder --target builder .

# Extract the built site
CID=$(docker create docs-builder)
docker cp "$CID":/out ./site
docker rm "$CID"
```
The generated files are now in ./site and ready to deploy.

## Use makefile
```bash
# Start local development
make start
```

```bash
# Production build
make build
```

```bash
# Delete `/site` folder
make clean
```