# Prueba Tecnica Primera Fase | Joseph Byron Lane

## Descripción del Proyecto
Este proyecto es una aplicación web desarrollada utilizando React, Redux Toolkit y TypeScript, que permite a los usuarios ver una lista simple de pokemon.

# Como Ejecutar el Proyecto

## Requisitos previos.
1. Tener Git instalado y clonar el repositorio en tu máquina local.
```bash
git clone https://github.com/Runeeeeeee7/poke-api.git
cd poke-api
```
2. Asegurate de tener instalado Node.js 22+.
3. Un navegador  web moderno como Chrome, Firefox o Edge.
4. Si uno lo desea, también se puede usar Docker para ejecutar el proyecto sin necesidad de instalar Node.js localmente.

## Ejecutar el Proyecto

Una vez todo descargado, entre al directorio del proyecto.

### NPM
El proyecto se puede correr local en una maquina utilizando NodeJS y NPM. Para esto, sigue los siguientes pasos:

1. Instala las dependencias del proyecto utilizando npm.
```bash
npm ci
```
2. Inicia el servidor de desarrollo.
```bash
npm run dev
```
3. Abre tu navegador y navega a `http://localhost:5177` para ver la aplicación en acción.

### Docker
Si prefieres usar Docker, puedes seguir estos pasos:
1. Asegúrate de tener Docker instalado y en funcionamiento en tu máquina. Deberias poder correr el comando `docker run hello-world` y te deberia mostrar un mensaje de hola de docker.

2. Levanta la applicacion usando Docker Compose
```bash
docker compose up
```

3. Abre tu navegador y navega a `http://localhost:8085` para ver la aplicación en acción.


## Troubleshooting.

Si encuentras algún problema al ejecutar el proyecto, aquí hay algunos pasos de solución de problemas que puedes seguir:
- Asegúrate de que todas las dependencias estén correctamente instaladas. Puedes intentar eliminar la carpeta `node_modules` y el archivo `package-lock.json`, y luego ejecutar `npm install`.
- Verifica que tu versión de Node.js sea compatible con el proyecto (Node.js 22+). Puedes verificar tu versión de Node.js con el comando `node -v`.
- Asegurese de que el puerto 5177 no esté siendo utilizado por otra aplicación en tu máquina. Puedes cambiar el puerto en el archivo `package.json` si es necesario.
- Si estás utilizando Docker, asegúrate de que el motor de Docker este ejecutandose correctamente. Puedes verificar esto con el comando `docker info` para ver los contenedores activos.
- Si estas utilizando Docker y tienes problemas con los puertos, asegúrate de que el puerto 8085 no esté siendo utilizado por otra aplicación en tu máquina. Puedes cambiar el puerto en el archivo `docker-compose.yml` si es necesario.
