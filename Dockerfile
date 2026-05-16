FROM node:22-alpine AS frontend-deps
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci

FROM frontend-deps AS frontend-build
COPY frontend ./
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM node:22-alpine AS backend-deps
WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci

FROM backend-deps AS backend-build
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-build /backend/node_modules ./node_modules
COPY --from=backend-build /backend/dist ./dist
COPY --from=backend-build /backend/package*.json ./
COPY --from=frontend-build /frontend/dist ./public
EXPOSE 10000
CMD ["npm", "start"]
