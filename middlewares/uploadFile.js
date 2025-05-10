const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

// Configuración del cliente de AWS S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Middleware para subir archivos a S3
const uploadToS3 = async (file, folder) => {
    const ext = path.extname(file.originalname);
    const uniqueName = uuidv4() + ext;

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${folder}/${uniqueName}`, // Ej: "users/99ba5d14-...jpg"
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(params));
    return uniqueName;
};

// Configuración de Multer en memoria (no guarda archivos localmente)
const storage = multer.memoryStorage();

// Middleware personalizado para detectar la ruta (users/products)
const upload = multer({ storage }).fields([
    { name: "avatar", maxCount: 1 },    // Para rutas de usuarios
    { name: "image", maxCount: 1 },     // Para rutas de productos
]);

// Middleware final que sube a S3
module.exports = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).send("Error al subir el archivo");

        // Determinar la carpeta en S3 según la ruta
        let folder;
        if (req.path.includes("/users")) folder = "users";
        if (req.path.includes("/products")) folder = "products";

        // Subir a S3 y guardar el nombre en req.fileData
        if (req.file) {
            try {
                const filename = await uploadToS3(req.file, folder);
                req.fileData = { filename };
                next();
            } catch (error) {
                console.error("Error subiendo a S3:", error);
                res.status(500).send("Error al guardar el archivo");
            }
        } else {
            next();
        }
    });
};