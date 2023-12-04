# Como correr la api
## Corrrer el contenedor de mongo db, el cliente mongo express y la api de mousecure
Despues ejecutar el docker compose
```bash
docker compose up -d
```
## Documentacion de la api
+ http://localhost:8000/docs
## Cliente de mongo db (mongo express)
+ http://localhost:8200/

Además se necesita crear la base de datos de mausecurebd para ello lo puedes hacer desde el cliente de mongo



# Generalidades
+ Se manejan
  + Todo el proyecto esta dentro de un volumen para que se actualize la información del contenedo de la api automaticamente
  en el ambiente de desarrollo
  

Mongo-express solo es un cliente mas de mongodb que le sirvio al equipo de desarrollo para poder hacer pruebas
El contenedor que contiene la api-rest de musicool se contruye por el dockerFile del proyecto
los demás servicios estan especificados en el docker compose así como la orquestación del mismo




