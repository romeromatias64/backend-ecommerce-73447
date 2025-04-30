const jwt = require('jsonwebtoken');
const SECRET = 'F0xTro7_99';


function isAuth(req, res, next) {
    const token = req.headers.access_token

    console.log(token)

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
    const token = req.headers.access_token

    console.log(token)

    if(!token) {
        return res.status(401).send('No tenes acceso a esta ruta');
    }

    jwt.verify(token, SECRET, (error, decoded) => {
        if(error) {
            return res.status(401).send("Token inválido")
        }

        req.user = decoded
        if(decoded.role !== "admin") {
            return res.status(401).send("No tenes acceso a esta ruta")
        }

        next()
    })
}

module.exports = {
    isAuth,
    isAdmin
}