
const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/auth.middleware");
console.log("ARCHIVO DE RUTAS DE PRODUCTOS CARGADO");

const {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require("../controllers/productos.controller");

router.get("/", listarProductos);
router.get("/prueba", (req, res) => {
    res.json({ mensaje: "Las rutas de productos funcionan" });
});
router.get("/:id", obtenerProducto);
router.post("/", verificarToken, crearProducto);
router.put("/:id", verificarToken, actualizarProducto);
router.delete("/:id", verificarToken, eliminarProducto);

module.exports = router;
