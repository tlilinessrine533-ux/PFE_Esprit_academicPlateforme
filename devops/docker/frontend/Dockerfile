# ===== Stage 1 : Build Angular =====
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production

# ===== Stage 2 : Servir avec Nginx =====
FROM nginx:alpine

# Copier la configuration Nginx (proxy /api → backend)
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers Angular compilés
# Note : Le chemin dépend du nom du projet dans angular.json
# Par défaut Angular 21 génère dans dist/<project-name>/browser/
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
