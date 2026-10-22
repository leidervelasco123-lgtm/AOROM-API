
const conexion = require("../config/database");
const bcrypt = require("bcryptjs");

// Registrar un cliente
async function crearCliente(req, res) {
    try {
        const { nombre, apellido, correo, password, telefono } = req.body;

        if (
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            typeof correo !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ||
            typeof password !== "string" ||
            password.length < 8 ||
            password.length > 72
        ) {
            return res.status(400).json({
                mensaje: "Ingresa un nombre, un correo válido y una contraseña de 8 a 72 caracteres"
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const [existentes] = await conexion.execute(
            "SELECT id_cliente FROM cliente WHERE correo = ?",
            [correoNormalizado]
        );

        if (existentes.length > 0) {
            return res.status(409).json({
                mensaje: "Este correo ya está registrado"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [resultado] = await conexion.execute(
            `INSERT INTO cliente
                (nombre, apellido, correo, password_hash, telefono)
             VALUES (?, ?, ?, ?, ?)`,
            [
                nombre.trim(),
                typeof apellido === "string" ? apellido.trim() : "",
                correoNormalizado,
                passwordHash,
                typeof telefono === "string" && telefono.trim()
                    ? telefono.trim()
                    : null
            ]
        );

        res.status(201).json({
            mensaje: "Cliente registrado correctamente",
            id_cliente: resultado.insertId
        });
    } catch (error) {
        console.error("Error al registrar cliente:", error.message);
        res.status(500).json({
            mensaje: "No se pudo registrar el cliente"
        });
    }
}

// Consultar clientes sin mostrar contraseñas
async function listarClientes(req, res) {
    try {
        const [clientes] = await conexion.execute(
            `SELECT id_cliente, nombre, apellido, correo, telefono
             FROM cliente
             ORDER BY id_cliente DESC`
        );

        res.json(clientes);
    } catch (error) {
        console.error("Error al consultar clientes:", error.message);
        res.status(500).json({
            mensaje: "No se pudieron consultar los clientes"
        });
    }
}

module.exports = { crearCliente, listarClientes };
