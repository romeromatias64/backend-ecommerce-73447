const app = require('./app.js')
const mongoose = require('mongoose');

const PORT = 3000;
const mongo_uri = "mongodb+srv://matiasaromero03:KkgJBE10XaCBvo62@73447-ecommerce.pountgr.mongodb.net/?retryWrites=true&w=majority&appName=73447-ecommerce"

mongoose.connect(mongo_uri,).then(() => {
    console.log("Conectado a la base de datos!")

    app.listen(PORT, () => {
        console.log("Servidor funcionando en el puerto", PORT);
    })

}).catch((err) => {console.log("Error al conectar a la base de datos:", err)});


