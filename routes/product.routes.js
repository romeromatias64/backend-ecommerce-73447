// const express = require("express");
// const router = express.Router();
const router = require("express").Router()
const productController = require("../controllers/product.controller")
const upload = require("../middlewares/uploadFile")

// Ruta para obtener los productos
router.get("/products", (productController.getProducts))

// Ruta para obtener un producto por ID
router.get("/products/:id", productController.getProductByID)

// Ruta para crear un producto
router.post("/products", upload, productController.createProduct)

// Ruta para eliminar un producto por ID
router.delete("/products/:id", productController.deleteProductByID)

// Ruta para actualizar un producto por ID
router.put("/products/:id", productController.updateProductByID)

// Exportamos el router para usarlo en otro archivo
module.exports = router