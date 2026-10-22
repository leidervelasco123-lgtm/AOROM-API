
const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/auth.middleware");

const {
    crearCliente,
    listarClientes
} = require("../controllers/clientes.controller");

// Registrar un cliente
router.post("/", crearCliente);

// Consultar clientes
router.get("/", verificarToken, listarClientes);

module.exports = router;
