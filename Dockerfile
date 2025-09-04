# ---------- base ----------
FROM python:3.12-slim AS base
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
# System deps for PlantUML
RUN apt-get update \
 && apt-get install -y --no-install-recommends openjdk-21-jre-headless graphviz curl \
 && rm -rf /var/lib/apt/lists/*
# PlantUML jar
RUN mkdir -p /opt/plantuml \
 && curl -fsSL https://github.com/plantuml/plantuml/releases/latest/download/plantuml.jar -o /opt/plantuml/plantuml.jar
# Python deps
WORKDIR /docs
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------- dev ----------
FROM base AS dev
# bind-mount your repo at /docs when running
EXPOSE 8000
CMD ["mkdocs","serve","-a","0.0.0.0:8000"]

# ---------- builder ----------
FROM base AS builder
# copy the project in for a clean, reproducible build
COPY . /docs
# output to /out so you can docker cp it
RUN mkdocs build --strict -d /out
