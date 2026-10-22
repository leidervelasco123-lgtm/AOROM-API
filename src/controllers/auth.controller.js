
const conexion = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function iniciarSesion(req, res) {
    try {
        const { correo, password } = req.body;

        if (
            typeof correo !== "string" ||
            typeof password !== "string" ||
            correo.trim() === "" ||
            password.length === 0 ||
            password.length > 72
        ) {
            return res.status(400).json({
                mensaje: "Debes ingresar el correo y la contraseña"
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const [clientes] = await conexion.execute(
            `SELECT id_cliente, nombre, correo, password_hash
             FROM CLIENTE
             WHERE correo = ?`,
            [correoNormalizado]
        );

        if (clientes.length === 0) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        const cliente = clientes[0];

        if (!cliente.password_hash) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            cliente.password_hash
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("Falta configurar JWT_SECRET");
            return res.status(500).json({
                mensaje: "El servidor no tiene configurada la autenticación"
            });
        }

        const token = jwt.sign(
            {
                id_cliente: cliente.id_cliente,
                correo: cliente.correo
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            mensaje: "Inicio de sesión satisfactorio",
            token,
            cliente: {
                id_cliente: cliente.id_cliente,
                nombre: cliente.nombre,
                correo: cliente.correo
            }
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);

        res.status(500).json({
            mensaje: "No se pudo iniciar sesión"
        });
    }
}

module.exports = {
    iniciarSesion
};
