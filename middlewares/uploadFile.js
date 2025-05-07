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
        const uniqueName = v4() + ext;

        req.body.image = uniqueName; // Guardar solo el nombre del archivo en el body
        
        console.log("Nombre de archivo único:", uniqueName);
        
        cb(null, uniqueName);
    }
});

const upload = multer({ storage }).single("image");

module.exports = upload