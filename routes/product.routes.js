const router = require("express").Router()
const productController = require("../controllers/product.controller")
const upload = require("../middlewares/uploadFile")

// Ruta para obtener los productos
router.get("/products", (productController.getProducts))

// Ruta para obtener un producto por ID
router.get("/products/:id", productController.getProductByID)

router.get("/uploads/products/:filename", (req, res) => {
    const filename = req.params.filename
    const path = `uploads/products/${filename}`
    res.download(path, filename, (err) => {
        if (err) {
            console.log(err)
            res.status(500).send("Error al descargar el archivo")
        }
    })
})

// Ruta para crear un producto
router.post("/products", upload.single("image"), productController.createProduct)

// Ruta para eliminar un producto por ID
router.delete("/products/:id", productController.deleteProductByID)

// Ruta para actualizar un producto por ID
router.put("/products/:id", upload.single("image"), productController.updateProductByID);

// Exportamos el router para usarlo en otro archivo
module.exports = router