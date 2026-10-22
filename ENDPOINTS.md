# API REST de AOROM Joyería

## 1. Descripción del proyecto

La API REST de AOROM Joyería permite administrar los productos y clientes de una tienda de joyería. También permite registrar clientes, iniciar sesión y proteger las operaciones que requieren autenticación.

La API fue desarrollada con Node.js y Express, utiliza MySQL para almacenar la información y JWT para controlar el acceso a las rutas protegidas.

## 2. Tecnologías utilizadas

* **Node.js:** entorno para ejecutar JavaScript en el servidor.
* **Express:** herramienta para crear las rutas de la API.
* **MySQL:** base de datos para almacenar productos y clientes.
* **mysql2:** permite conectar Node.js con MySQL.
* **bcryptjs:** permite proteger las contraseñas mediante cifrado hash.
* **jsonwebtoken (JWT):** permite generar y verificar tokens de autenticación.
* **dotenv:** permite cargar variables de configuración desde el archivo `.env`.

## 3. Instalación y ejecución

### Requisitos

* Node.js instalado.
* MySQL instalado y funcionando.
* Base de datos de AOROM Joyería creada.
* Variables de conexión configuradas en el archivo `.env`.

### Pasos para ejecutar la API

1. Abrir la carpeta `AOROM-API` en Visual Studio Code.

2. Abrir la terminal.

3. Instalar las dependencias:

   `npm.cmd install`

4. Iniciar el servidor:

   `npm.cmd start`

5. Abrir el navegador y visitar:

   `http://localhost:3000`

Si la configuración es correcta, la API responderá con un mensaje que confirma que está funcionando.

**Nota:** No se deben publicar las contraseñas ni las claves secretas del archivo `.env`.

## 4. Códigos de respuesta HTTP

La API utiliza códigos de estado HTTP para indicar el resultado de cada solicitud.

| Código                    | Significado                                            |
| ------------------------- | ------------------------------------------------------ |
| 200 OK                    | La solicitud se procesó correctamente.                 |
| 201 Created               | Se creó un registro correctamente.                     |
| 400 Bad Request           | La solicitud contiene datos incorrectos o incompletos. |
| 401 Unauthorized          | Se requiere autenticación o el token no es válido.     |
| 404 Not Found             | El recurso solicitado no existe.                       |
| 500 Internal Server Error | Ocurrió un error interno en el servidor.               |

Los códigos que devuelve cada endpoint dependen de la operación realizada y de las validaciones del servidor.


# API de AOROM Joyería

## 1. Información general

* **Tecnologías:** Node.js, Express, MySQL y JWT.
* **Servidor local:** `http://localhost:3000`
* **Formato de intercambio:** JSON.

## 2. Productos

| Método | Endpoint             | Descripción                  | Autenticación |
| ------ | -------------------- | ---------------------------- | ------------- |
| GET    | `/api/productos`     | Listar productos             | No            |
| GET    | `/api/productos/:id` | Consultar un producto por ID | No            |
| POST   | `/api/productos`     | Crear un producto            | Sí            |
| PUT    | `/api/productos/:id` | Actualizar un producto       | Sí            |
| DELETE | `/api/productos/:id` | Eliminar un producto         | Sí            |

### Datos para crear o actualizar productos

```json
{
  "nombre_producto": "Anillo Dorado",
  "precio": 120000,
  "stock": 5,
  "id_categoria": 1
}
```

Las categorías deben existir en la base de datos.

## 3. Clientes

| Método | Endpoint        | Descripción          | Autenticación |
| ------ | --------------- | -------------------- | ------------- |
| POST   | `/api/clientes` | Registrar un cliente | No            |
| GET    | `/api/clientes` | Listar clientes      | Sí            |

## 4. Autenticación

| Método | Endpoint          | Descripción                           |
| ------ | ----------------- | ------------------------------------- |
| POST   | `/api/auth/login` | Iniciar sesión y obtener un token JWT |

### Inicio de sesión

Ejemplo del cuerpo de la petición:

```json
{
  "correo": "cliente@ejemplo.com",
  "password": "contraseña_de_prueba"
}
```

Para acceder a las rutas protegidas, se debe enviar el token mediante la cabecera:

`Authorization: Bearer <token>`

## 5. Respuestas HTTP habituales

* `200 OK`: operación realizada correctamente.
* `201 Created`: recurso creado correctamente, si así lo establece el controlador.
* `400 Bad Request`: datos incorrectos o incompletos.
* `401 Unauthorized`: falta un token válido.
* `404 Not Found`: recurso o ruta no encontrado.
* `500 Internal Server Error`: error interno del servidor.

## 6. Observación

Esta documentación describe las rutas configuradas en el proyecto. Los mensajes exactos y los códigos de respuesta pueden variar según la implementación de cada controlador.
