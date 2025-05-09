const dotenv = require('dotenv').config()
const app = require('./app.js')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI

// Scriopt para crear directorios al iniciar 
const uploadDirs = [
    path.join("/tmp", "uploads/products"),
    path.join("/tmp", "uploads/users")
];

uploadDirs.forEach(dir => {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directorio creado: ${dir}`);
    }
})

mongoose.connect(mongo_uri,).then(() => {
    console.log("Conectado a la base de datos!")

    app.listen(PORT, () => {
        console.log("Servidor funcionando en el puerto", PORT);
    })

}).catch((err) => {console.log("Error al conectar a la base de datos:", err)});


