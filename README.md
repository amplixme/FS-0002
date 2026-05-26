# FS-0002
# 📦 Amplix Acceleration Program — Javascript

## 🛠️ Descripción del proyecto
Es una aplicación web que funciona como un blog de noticias tecnológicas, donde los usuarios pueden registrarse e iniciar sesión para publicar contenido, comentar y reaccionar a las publicaciones de otros usuarios.

La plataforma cuenta con un sistema de autenticación y gestión de roles, permitiendo el acceso tanto a administradores como a usuarios comunes. Cada usuario dispone de un perfil personalizado en el que se pueden visualizar sus publicaciones, comentarios e interacciones dentro de la comunidad.

Además, el blog está organizado por categorías temáticas, lo que facilita la publicación y búsqueda de contenido relacionado con áreas como diseño, programación, testing, DevOps, entre otras tecnologías.

---

## 🛠️ Tech Stack

| Capa       | Tecnología                      |
|------------|----------------------------------|
| Frontend   | React + Vite                    |
| Backend    | Node.js + Express               |
| Base de datos | PostgreSQL                   |
| ORM        | Prisma            |
| Auth       | JWT (JSON Web Tokens)           |
| Estilos    | Tailwind CSS / CSS Modules      |

---

## 📋 Requisitos previos

Asegurate de tener instalado lo siguiente antes de comenzar:
- [Visual Studio Code](https://code.visualstudio.com/Download/) (Elegir versión de acuerdo al sistema operativo)
- [Node.js](https://nodejs.org/) versión LTS 24.16
- [npm](https://www.npmjs.com/) versión 11.9
- [PostgreSQL](https://www.postgresql.org/) (Opcional ya que se está trabajando con PostgreSQL en la nube de prisma)
- [Git](https://git-scm.com/)

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/amplixme/FS-0002.git
cd FS-0002
```
- Una vez clonado el repositorio ya pasamos a hacer las configuraciones correspondientes del backend y del frontend para poder arrancar el proyecto.
---

### 2. Configurar el Backend

```bash
cd backend
npm install
```

El npm install permite que se instalen las dependencias correspondientes al proyecto, en este caso se instalan las dependencias que están involucradas en el archivo package.json

```bash
cp .env.example .env
```

Este comando lo que hace es copiar el contenido que tiene el archivo .env.example al archivo .env local, en caso que el archivo .env no exista, este lo crea.

#### Correr migraciones de base de datos

```bash
# Prisma:
npx prisma generate
npx prisma migrate dev
```

#### Iniciar el servidor backend

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---

### 3. Configurar el Frontend

```bash
cd ../frontend/amplix-blog
npm install
```

Este npm install hace lo mismo que el anterior, instala las dependencias pero en este caso las que están involucradas con el frontend.

```bash
cp .env.example .env
```
Al ejecutar este comando, va a copiar lo que tiene el archivo .env.example a tu archivo .env local con el puerto (en caso que el archivo no exista, este lo crea), URL de la base de datos y JWT_secretas correspondientes que van a permitir poder levantar el proyecto de manera satisfactoria.
Se debe ingresar al archivo .env y realizar las modificaciones correspondientes que se indicarán en el mismo archivo.

#### Iniciar el servidor frontend

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 🔐 Variables de entorno

### Backend (`backend/.env`)

| Variable       | Descripción                                         | Ejemplo                                          |
|----------------|------------------------------------------------------|--------------------------------------------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL                        | `postgresql://user:password@localhost:5432/dbname` |
| `JWT_SECRET`   | Clave secreta para firmar los tokens JWT             | `una-clave-super-secreta-larga`                  |
| `PORT`         | Puerto en el que corre el servidor                   | `3000`                                           |

### Frontend (`frontend/.env`)

| Variable        | Descripción                          | Ejemplo                      |
|-----------------|---------------------------------------|------------------------------|
| `VITE_API_URL`  | URL base del backend                  | `http://localhost:3000/api`  |

---

## 📁 Estructura del proyecto

```
nombre-del-proyecto/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

---



## ❓ Problemas comunes

**Error de conexión a la base de datos:**  
Verificá que PostgreSQL esté corriendo y que `DATABASE_URL` en el `.env` sea correcta.

**Puerto en uso:**  
Cambiá el valor de `PORT` en el `.env` o matá el proceso que está usando ese puerto.

**Token inválido:**  
Asegurate de que `JWT_SECRET` sea el mismo en el `.env` y que no haya cambiado entre sesiones.
