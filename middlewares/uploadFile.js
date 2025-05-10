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
        Key: `${folder}/${uniqueName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read", // Permiso de lectura público
    };

    await s3Client.send(new PutObjectCommand(params));
    return uniqueName;
};

// Configuración de Multer en memoria
const storage = multer.memoryStorage();

// Middleware personalizado para detectar la ruta (users/products)
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes"), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
}).fields([
    { name: "avatar", maxCount: 1 },    // Para usuarios
    { name: "image", maxCount: 1 },     // Para productos
]);

// Middleware final que sube a S3
module.exports = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error en Multer:", err);
            return res.status(500).send("Error al subir el archivo");
        }

        // Determinar la carpeta en S3 según la ruta
        let folder;
        if (req.path.includes("/users")) folder = "users";
        if (req.path.includes("/products")) folder = "products";

        // Obtener el archivo según la ruta
        if (req.files?.avatar) {
            req.file = req.files.avatar[0];
        } else if (req.files?.image) {
            req.file = req.files.image[0];
        }

        // Subir a S3 y guardar el nombre en req.fileData
        if (req.file) {
            try {
                // Validar tipo de archivo
                if (!req.file.mimetype.startsWith("image/")) {
                    return res.status(400).send("Formato de imagen no válido");
                }

                const filename = await uploadToS3(req.file, folder);
                req.fileData = { 
                    filename,
                    url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${filename}`
                };
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