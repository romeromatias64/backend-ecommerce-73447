const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4 } = require("uuid");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir;

        // Definimos el directorio de destino según el tipo de archivo
        if (req.path.includes('/products')) {
            dir = path.join(__dirname, '../uploads/products');
        }
        if (req.path.includes('/users')) {
            dir = path.join(__dirname, '../uploads/users');
        }

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = v4() + ext;

        // Guardar la ruta relativa en el body
        if (req.path.includes('/products')) {
            req.body.image = `uploads/products/${name}`;
        }
        if (req.path.includes('/users')) {
            req.body.image = `uploads/users/${name}`;
        }

        cb(null, name);
    }
});

const upload = multer({ storage }).single("image");

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Error en multer:", err);
            return res.status(500).send({ message: "Error al procesar el archivo" });
        }
        next();
    });
};