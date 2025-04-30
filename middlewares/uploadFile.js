const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4 } = require("uuid");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        let dir;

        // Log para verificar el path de la solicitud
        console.log("Ruta de la solicitud:", req.path);

        // Definimos el directorio de destino según el tipo de archivo
        if(req.path.includes('/products')) {
            dir = path.join(__dirname, '../uploads/products')
        }
        if(req.path.includes('/users')) {
            dir = path.join(__dirname, '../uploads/users')
        }

        // Log para verificar el directorio de destino
        console.log("Directorio de destino:", dir);

        if(!fs.existsSync(dir)) {
            console.log("Directorio no existe, creando:", dir);
            fs.mkdirSync(dir, {recursive: true})
        }

        cb (null, dir)
    },

    filename: (req, file, cb) => {
        // Log para verificar el archivo recibido
        console.log("Archivo recibido:", file);
        const ext = path.extname(file.originalname)
        const name = v4() + ext

         // Log para verificar el nombre del archivo generado
        console.log("Nombre del archivo generado:", name);

        cb(null, name)
    }
})

const upload = multer({storage}).single("image")

module.exports = (req, res, next) => {
    console.log("Middleware uploadFile ejecutado");
    upload(req, res, (err) => {
        if (err) {
            console.error("Error en multer:", err);
            return res.status(500).send({ message: "Error al procesar el archivo" });
        }
        console.log("Archivo procesado correctamente");
        next();
    });
};