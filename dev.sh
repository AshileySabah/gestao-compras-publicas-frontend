#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
BACK=../gestao-compras-publicas-backend
FRONT=.

case "$1" in
  -BD) cd "$BACK"; ./mvnw spring-boot:run ;;
  -BZ) cd "$BACK"; ./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.jpa.hibernate.ddl-auto=create ;;
  -F) cd "$FRONT"; [ -d node_modules ] || npm install; npm run dev ;;
  -FB) (cd "$FRONT"; [ -d node_modules ] || npm install; npm run build:backend); cd "$BACK"; ./mvnw spring-boot:run ;;
  *) echo "Uso: ./dev.sh -BD | -BZ | -F | -FB"; exit 1 ;;
esac
