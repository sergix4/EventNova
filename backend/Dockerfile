# 1. Usar una imagen oficial de Node.js (versión 20 ligera)
FROM node:20-alpine

# 2. Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar primero los archivos de paquetes (aprovecha la caché de Docker)
COPY package*.json ./

# 4. Instalar las dependencias de Node.js
RUN npm install

# 5. Copiar el resto del código fuente del backend al contenedor
COPY . .

# 6. Exponer el puerto (Railway inyecta su propia variable PORT, pero es buena práctica declararlo)
EXPOSE 3000

# 7. Comando para iniciar el servidor (asegúrate de que apunte a tu punto de entrada real)
CMD ["node", "app.js"]