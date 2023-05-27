# Backend

## Configuración de base de datos

En el archivo `src/config/global.ts` se debe colocar el host (para pruebas locales localhost)

# Compilar dependecias
Para compilar el proyecto se debe correr el siguiente comando en la carpeta raiz del proyecto

    npm install

# Iniciar app

    npm run dev

# docker
para trabajar con docker se pasan las variables de entono:
MONGO_HOSTNAME = 127.0.0.1
MONGO_PORT = 27017
MONGO_DB = test