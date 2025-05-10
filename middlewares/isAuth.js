const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_JWT


function isAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del encabezado de autorización

    if(!token) {
        return res.status(401).send('No tenes acceso a esta ruta');
    }

    jwt.verify(token, SECRET, (error, decoded) => {
        if(error) {
            return res.status(401).send("Token inválido")
        }

        req.user = decoded
        next()
    })
}


function isAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).send('Acceso denegado');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET, (error, decoded) => {
        if(error) {
            return res.status(401).send("Token inválido o expirado")
        }

        if(decoded.role !== 'admin') {
            return res.status(403).send("No tenes permisos para acceder a esta ruta")
        }

        req.user = decoded
        next()
    })
}

module.exports = {
    isAuth,
    isAdmin
}