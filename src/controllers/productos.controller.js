
const conexion = require("../config/database");

// 1. Consultar todos los productos
async function listarProductos(req, res) {
    try {
        const [productos] = await conexion.execute(`
            SELECT
                p.id_producto,
                p.nombre_producto,
                p.precio,
                p.stock,
                p.id_categoria,
                c.nombre_categoria
            FROM producto p
            LEFT JOIN categoria c
                ON p.id_categoria = c.id_categoria
            ORDER BY p.id_producto DESC
        `);

        res.json(productos);
    } catch (error) {
        console.error("Error al listar productos:", error.message);
        res.status(500).json({
            mensaje: "No se pudieron consultar los productos"
        });
    }
}

// 2. Consultar un producto por su ID
async function obtenerProducto(req, res) {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                mensaje: "El ID del producto no es válido"
            });
        }

        const [productos] = await conexion.execute(
            `SELECT id_producto, nombre_producto, precio, stock, id_categoria
             FROM producto
             WHERE id_producto = ?`,
            [id]
        );

        if (productos.length === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json(productos[0]);
    } catch (error) {
        console.error("Error al consultar producto:", error);
        return res.status(500).json({
            mensaje: "No se pudo consultar el producto",
            error: error.messaje
        });
    }
}

// 3. Crear un producto
async function crearProducto(req, res) {
    try {
        const { nombre_producto, precio, stock, id_categoria } = req.body;

        if (
            typeof nombre_producto !== "string" ||
            nombre_producto.trim() === "" ||
            nombre_producto.trim().length > 100 ||
            precio === undefined ||
            precio === null ||
            precio === "" ||
            !Number.isFinite(Number(precio)) ||
            Number(precio) < 0 ||
            !Number.isInteger(Number(stock)) ||
            Number(stock) < 0 ||
            !Number.isInteger(Number(id_categoria)) ||
            Number(id_categoria) <= 0
        ) {
            return res.status(400).json({
                mensaje: "Revisa el nombre, precio, stock y categoría del producto"
            });
        }

        const [categorias] = await conexion.execute(
            "SELECT id_categoria FROM categoria WHERE id_categoria = ?",
            [id_categoria]
        );

        if (categorias.length === 0) {
            return res.status(400).json({
                mensaje: "La categoría seleccionada no existe"
            });
        }

        const [resultado] = await conexion.execute(
            `INSERT INTO producto
                (nombre_producto, precio, stock, id_categoria)
             VALUES (?, ?, ?, ?)`,
            [nombre_producto.trim(), Number(precio), Number(stock), Number(id_categoria)]
        );

        res.status(201).json({
            mensaje: "Producto creado correctamente",
            id_producto: resultado.insertId
        });
    } catch (error) {
        console.error("Error al crear producto:", error.message);
        res.status(500).json({
            mensaje: "No se pudo crear el producto"
        });
    }
}

// 4. Actualizar un producto
async function actualizarProducto(req, res) {
    try {
        const { id } = req.params;
        const { nombre_producto, precio, stock, id_categoria } = req.body;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                mensaje: "El ID del producto no es válido"
            });
        }

        if (
            typeof nombre_producto !== "string" ||
            nombre_producto.trim() === "" ||
            nombre_producto.trim().length > 100 ||
            precio === undefined ||
            precio === null ||
            precio === "" ||
            !Number.isFinite(Number(precio)) ||
            Number(precio) < 0 ||
            !Number.isInteger(Number(stock)) ||
            Number(stock) < 0 ||
            !Number.isInteger(Number(id_categoria)) ||
            Number(id_categoria) <= 0
        ) {
            return res.status(400).json({
                mensaje: "Revisa el nombre, precio, stock y categoría del producto"
            });
        }

        const [categorias] = await conexion.execute(
            "SELECT id_categoria FROM categoria WHERE id_categoria = ?",
            [id_categoria]
        );

        if (categorias.length === 0) {
            return res.status(400).json({
                mensaje: "La categoría seleccionada no existe"
            });
        }

        const [resultado] = await conexion.execute(
            `UPDATE producto
             SET nombre_producto = ?, precio = ?, stock = ?, id_categoria = ?
             WHERE id_producto = ?`,
            [
                nombre_producto.trim(),
                Number(precio),
                Number(stock),
                Number(id_categoria),
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto actualizado correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto:", error.message);
        res.status(500).json({
            mensaje: "No se pudo actualizar el producto"
        });
    }
}

// 5. Eliminar un producto
async function eliminarProducto(req, res) {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                mensaje: "El ID del producto no es válido"
            });
        }

        const [resultado] = await conexion.execute(
            "DELETE FROM producto WHERE id_producto = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto eliminado correctamente"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                mensaje: "No se puede eliminar el producto porque está relacionado con un pedido"
            });
        }

        console.error("Error al eliminar producto:", error.message);
        res.status(500).json({
            mensaje: "No se pudo eliminar el producto"
        });
    }
}

module.exports = {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
