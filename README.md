# Commission Board

Aplicación web full-stack para organizar una lista personal de comisiones. El proyecto contiene únicamente funcionalidades relacionadas con **Commission Board**: autenticación, perfil y CRUD de comisiones.

## Funcionalidades

- Registro e inicio de sesión.
- Perfil de usuario con nombre, correo y foto.
- Lista personal de comisiones por usuario.
- Crear una comisión con descripción, estado y hasta **8 imágenes**.
- Carrusel cuando una comisión tiene más de una imagen.
- Editar descripción, estado, imágenes existentes y añadir nuevas imágenes.
- Eliminar comisiones.
- Estados de carga, error y éxito.
- API REST con GET, POST, PUT y DELETE.
- Frontend principal en React + TypeScript.
- Backend Express + MongoDB/Mongoose.

## Estados de una comisión

- `En proceso`
- `Atrasado`
- `Completado`

## Instalación local

1. Instala dependencias:

```bash
npm install
```

2. Copia `.env.example` como `.env` y agrega tu conexión:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/commission-board
PORT=3000
```

Para Atlas reemplaza `MONGODB_URI` por tu cadena `mongodb+srv://...`.

3. Comprueba TypeScript:

```bash
npm run typecheck
```

4. Construye React:

```bash
npm run build
```

5. Inicia la aplicación:

```bash
npm start
```

6. Abre `http://localhost:3000`.

## API

| Método | Endpoint | Acción |
| --- | --- | --- |
| POST | `/api/register` | Registrar usuario |
| POST | `/api/login` | Iniciar sesión |
| GET | `/api/users/:userid` | Obtener usuario |
| PUT | `/api/users/:userid` | Editar usuario |
| GET | `/api/comisiones?creador=USER_ID` | Listar comisiones |
| POST | `/api/comisiones` | Crear comisión |
| GET | `/api/comisiones/:comisionid` | Obtener comisión |
| PUT | `/api/comisiones/:comisionid` | Editar comisión |
| DELETE | `/api/comisiones/:comisionid` | Eliminar comisión |

POST/PUT de comisiones usan `multipart/form-data` con `userId`, `descripcion`, `estado` e `imagenes` (máximo 8 archivos, 1 MB cada uno).


