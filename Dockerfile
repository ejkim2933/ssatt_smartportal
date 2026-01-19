# 1단계: 빌드 환경 (Vite 프론트엔드 빌드)
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실행 환경 (보안 및 최적화 버전)
FROM node:20-slim
WORKDIR /app
# 빌드된 결과물만 가져와서 가볍고 안전하게 만듭니다.
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# Cloud Run 표준 포트 설정
ENV NODE_ENV=production
ENV PORT 8080
EXPOSE 8080

# 서버 실행
CMD ["node", "server.js"]
