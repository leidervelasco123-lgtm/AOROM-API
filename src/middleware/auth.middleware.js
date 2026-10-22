
const jwt = require("jsonwebtoken");
console.log("ARCHIVO DEL MIDDLEWARE CARGADO");

function verificarToken(req, res, next) {
    console.log("MIDDLEWARE DE AUTENTICACIÓN EJECUTADO");

    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
        return res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder a este recurso"
        });
    }

    const token = autorizacion.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensaje: "Token no proporcionado"
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            mensaje: "El servidor no tiene configurada la autenticación"
        });
    }

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos;
        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido o vencido"
        });
    }
}

module.exports = verificarToken;
