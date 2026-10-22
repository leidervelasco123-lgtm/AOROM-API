
require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const productosRoutes = require("./routes/productos.routes");
const clientesRoutes = require("./routes/clientes.routes");
const authRoutes = require("./routes/auth.routes");

app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API de AOROM Joyería",
        estado: "API funcionando correctamente"
    });
});

app.use("/api/productos", (req, res, next) => {
    console.log("Petición recibida:", req.method, req.originalUrl);
    next();
});
app.use("/api/productos", productosRoutes);

console.log("Rutas de productos cargadas");
app.get("/prueba", (req, res) => {
    res.send("Las rutas de AOROM API están funcionando");
});

app.use("/api/clientes", (req, res, next) => {
    console.log("PETICIÓN DE CLIENTES RECIBIDA:", req.method, req.originalUrl);
    next();
});
app.use("/api/clientes", clientesRoutes);

app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({
        mensaje: "La ruta solicitada no existe",
        ruta: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
