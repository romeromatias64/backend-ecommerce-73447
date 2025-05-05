const express = require('express')
const cors = require('cors')
const routes = require("./routes/index")
const path = require('path')
const app = express()

// Middlewares

// Middleware para manejar/leer el body de las peticiones
app.use(express.json())

// Leer archivos carpeta publica uploads
app.use(express.static(path.join(__dirname, 'uploads')))

// Configuración de CORS
const corsOptions = {
    origin: 'https://frontend-ecommerce-73447.onrender.com', // Dominio del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.use("/api", routes)

module.exports = app;

