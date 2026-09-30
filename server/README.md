# 🍳 RecipeHub API

API REST del proyecto **RecipeHub**, una pequeña red social de recetas. Los usuarios se registran, publican sus recetas y pueden ver los perfiles de otros usuarios con sus recetas.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)

## 🛠️ Tecnologías

- **Node.js + Express 5**: servidor y rutas
- **MongoDB Atlas + Mongoose**: base de datos y modelos
- **JWT**: autenticación con token
- **bcryptjs**: contraseñas cifradas
- **CORS y dotenv**: peticiones desde el front y variables de entorno
- **Nodemon**: reinicio automático en desarrollo
- **Mocha, Chai y Supertest**: tests de integración

## 📁 Estructura

```
server/
├── src/
│   ├── config/
│   │   └── db.js              Conexión a MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── recipe.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── auth.js            Verificación del token (isAuth)
│   ├── models/
│   │   ├── User.js
│   │   └── Recipe.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── recipe.routes.js
│   │   └── user.routes.js
│   ├── app.js                 Configuración de Express
│   └── index.js               Arranque del servidor
├── test/
│   ├── setup.js               Carga .env.test y conecta a la base de datos
│   ├── app.test.js
│   ├── auth.test.js
│   ├── recipe.test.js
│   └── user.test.js
├── .env.example
├── .env.test                  (no se sube al repositorio)
├── .mocharc.json              Configuración de Mocha
└── package.json
```

## ⚙️ Instalación

```bash
cd server
npm install
```

Crea un archivo `.env` a partir del ejemplo y rellénalo:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `MONGO_URI` | Cadena de conexión de MongoDB (incluye el nombre de la base de datos: `recipehub`) |
| `PORT` | Puerto del servidor (por defecto `4000`) |
| `JWT_SECRET` | Clave secreta para firmar los tokens |

## 📜 Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca el servidor con nodemon (se reinicia al guardar) |
| `npm start` | Arranca el servidor con Node |
| `npm test` | Ejecuta los tests con Mocha |

El servidor queda en `http://localhost:4000`.

## 🧪 Tests

Tests de integración con **Mocha**, **Chai** y **Supertest**. Comprueban la API completa contra una base de datos de pruebas.

### Configuración

Crea `server/.env.test` con las mismas variables que `.env`, pero apuntando a **otra base de datos**:

```
MONGO_URI=<tu URL de Atlas>/recipehub_test?retryWrites=true&w=majority
PORT=4001
JWT_SECRET=secreto_de_test
```

Los tests borran datos, así que `test/setup.js` se niega a arrancar si `MONGO_URI` no contiene `test`. Así nunca se tocan los datos reales.

### Ejecutar

```bash
npm test
```

### Qué se prueba

| Archivo | Cubre |
|---|---|
| `app.test.js` | Mensaje de bienvenida |
| `auth.test.js` | Registro, validaciones (422), email duplicado (400), login correcto y credenciales inválidas (401) |
| `recipe.test.js` | Crear con y sin token, campos obligatorios, ver por id, id inválido (400), no encontrada (404), editar y borrar, y que otro usuario no pueda hacerlo (403) |
| `user.test.js` | Perfil público con sus recetas, sin email ni contraseña, id inválido (400) y usuario inexistente (404) |

## 🗃️ Modelos

### User

| Campo | Tipo | Notas |
|---|---|---|
| `name` | String | Obligatorio |
| `email` | String | Obligatorio, único, en minúsculas |
| `password` | String | Obligatorio, cifrada. No se devuelve en las consultas |

### Recipe

| Campo | Tipo | Notas |
|---|---|---|
| `title` | String | Obligatorio |
| `description` | String | Opcional |
| `image` | String | Opcional |
| `ingredients` | String | Obligatorio. Un ingrediente por línea |
| `steps` | String | Obligatorio. Un paso por línea |
| `category` | String | `desayuno`, `comida`, `cena`, `postre`, `snack`, `otros` (por defecto `otros`) |
| `difficulty` | String | `fácil`, `media`, `difícil` (por defecto `fácil`) |
| `cookingTime` | Number | Minutos (por defecto `0`) |
| `author` | ObjectId | Referencia a `User`. Se asigna desde el token |

Ambos modelos incluyen `createdAt` y `updatedAt`.

## 🔐 Autenticación

Las rutas protegidas necesitan el token que devuelve el login en la cabecera:

```
Authorization: Bearer <token>
```

El token caduca a los 7 días.

## 📡 Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Iniciar sesión |
| GET | `/recipes` | No | Listar recetas (más recientes primero) |
| GET | `/recipes/:id` | No | Ver una receta |
| POST | `/recipes` | Sí | Crear receta |
| PUT | `/recipes/:id` | Sí (autor) | Editar receta |
| DELETE | `/recipes/:id` | Sí (autor) | Eliminar receta |
| GET | `/users/:id` | No | Perfil público con sus recetas |

### Ejemplos

**POST `/auth/register`**

```json
{
  "name": "Sergio",
  "email": "sergio@test.com",
  "password": "123456"
}
```

Respuesta `201`:

```json
{
  "message": "Usuario registrado correctamente",
  "user": { "_id": "...", "name": "Sergio", "email": "sergio@test.com" }
}
```

**POST `/auth/login`**

```json
{
  "email": "sergio@test.com",
  "password": "123456"
}
```

Respuesta `200`:

```json
{
  "message": "Inicio de sesión correctamente",
  "token": "eyJhbGciOi...",
  "user": { "_id": "...", "name": "Sergio", "email": "sergio@test.com" }
}
```

**POST `/recipes`** (requiere token)

```json
{
  "title": "Tortilla de patatas",
  "description": "La clásica",
  "ingredients": "4 patatas\n6 huevos\n1 cebolla\nAceite de oliva\nSal",
  "steps": "Pela y corta las patatas\nFríelas a fuego lento\nMezcla con el huevo batido\nCuaja la tortilla por ambos lados",
  "category": "cena",
  "difficulty": "media",
  "cookingTime": 40
}
```

Respuesta `201`:

```json
{
  "message": "Receta creada correctamente",
  "recipe": { "_id": "...", "title": "Tortilla de patatas", "author": "..." }
}
```

**GET `/users/:id`**

```json
{
  "user": { "_id": "...", "name": "Sergio", "createdAt": "..." },
  "recipes": [ { "_id": "...", "title": "Tortilla de patatas" } ]
}
```

## 📋 Códigos de respuesta

| Código | Cuándo |
|---|---|
| `200` / `201` | Petición correcta / recurso creado |
| `400` | ID no válido o correo ya registrado |
| `401` | Credenciales inválidas, token ausente o no válido |
| `403` | Intentas editar o borrar una receta que no es tuya |
| `404` | Receta o usuario no encontrado |
| `422` | Faltan campos o no son válidos |
| `500` | Error del servidor |

## 📝 Notas

- El `author` de una receta siempre sale del token, nunca del body.
- Solo el autor puede editar o eliminar su receta.
- El perfil público (`/users/:id`) no expone el email.
- Si `mongodb+srv` falla con `querySrv ECONNREFUSED`, el DNS de tu red está bloqueando la consulta. En `index.js` y en `test/setup.js` se fuerzan los DNS de Google y Cloudflare para evitarlo.

## 🚀 Próximas versiones

- [x] Tests con Mocha, Chai y Supertest
- [ ] Seeders con datos de ejemplo
- [ ] Likes
- [ ] Comentarios
- [ ] Guardar recetas de otros usuarios
- [ ] Búsqueda y filtro por categorías
- [ ] Subida de imágenes