const express = require('express')
const cors = require('cors')
const routes = require("./routes/index")
const path = require('path')
const app = express()

// Middlewares

// Middleware para manejar/leer el body de las peticiones
app.use(express.json())

// Leer archivos carpeta publica uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de CORS
const corsOptions = {
    origin: 'https://frontend-ecommerce-73447.onrender.com', // Dominio del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true, // Permitir tokens
    exposeHeaders: ['Authorization'], // Headers expuestos
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use("/api", routes)

module.exports = app;

