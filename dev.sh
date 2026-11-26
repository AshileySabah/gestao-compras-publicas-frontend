#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
BACK=../gestao-compras-publicas-backend
FRONT=.
ZERAR=-Dspring-boot.run.arguments=--spring.jpa.hibernate.ddl-auto=create

gerar_front() { (cd "$FRONT"; [ -d node_modules ] || npm install; npm run build:backend); }

abrir_quando_subir() {
  PORTA=$(grep -E '^SERVER_PORT=' "$BACK/.env" 2>/dev/null | cut -d= -f2 | tr -d '\r')
  URL=http://localhost:${PORTA:-8080}
  (for i in $(seq 150); do
    if curl -s -o /dev/null "$URL"; then
      if command -v xdg-open > /dev/null; then xdg-open "$URL"; elif command -v open > /dev/null; then open "$URL"; else start "$URL"; fi
      break
    fi
    sleep 2
  done) &
}

case "$1" in
  -BD) cd "$BACK"; ./mvnw spring-boot:run ;;
  -BZ) cd "$BACK"; ./mvnw spring-boot:run "$ZERAR" ;;
  -F) cd "$FRONT"; [ -d node_modules ] || npm install; npm run dev -- --open ;;
  -FBD) gerar_front; abrir_quando_subir; cd "$BACK"; ./mvnw spring-boot:run ;;
  -FBZ) gerar_front; abrir_quando_subir; cd "$BACK"; ./mvnw spring-boot:run "$ZERAR" ;;
  *) echo "Uso: ./dev.sh -BD | -BZ | -F | -FBD | -FBZ"; exit 1 ;;
esac
