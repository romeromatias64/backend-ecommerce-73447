const express = require('express')
const cors = require('cors')
const routes = require("./routes/index")
const path = require('path')
const app = express()

// Middlewares

// Middleware para manejar/leer el body de las peticiones
app.use(express.json())

// Servir archivos desde /tmp/uploads/users y /tmp/uploads/products
app.use("/api/uploads/products", express.static(path.join('/tmp', 'uploads/products')))
app.use("/api/uploads/users", express.static(path.join('/tmp', 'uploads/users')))

// Configuración de CORS
const corsOptions = {
    origin: 'https://frontend-ecommerce-73447.onrender.com', // Dominio del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Headers permitidos
    credentials: true, // Permitir tokens
    preflightContinue: false, // Continuar con la siguiente función de middleware
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use("/api", routes)

module.exports = app;

