const Product = require("../models/product.model")
// const { path } = require("../app")
const fs = require("fs")
const path = require("path")

const AWS_URL = process.env.AWS_URL


async function createProduct(req, res) {
    try {
        // Si no se envía originalPrice, se asigna el valor de price
        if (!req.body.originalPrice) {
            req.body.originalPrice = req.body.price;
        }

        if(req.fileData?.filename) {
            req.body.image = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/products/${req.fileData.filename}` // Guardamos la ruta de la imagen en el body
        } else {
            req.body.image = "https://www.utqiagvik.us/wp-content/uploads/2022/08/pngwing.com_.png"
        }

        const product = new Product(req.body)
        
        const newProduct = await product.save()

        return res.status(201).send({
            message: "Producto creado correctamente",
            product: newProduct
        })
        
    } catch (error) {
        console.error("Error en createProduct: ", error)
        res.status(500).send({ message: "Error al crear el producto", error: error.message })
    }
}


async function getProducts(req, res) {
    try {
        const products = await Product.find({})
        res.status(200).send({products})
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error al obtener los productos" })
    }
}

function  getProductByID(req, res) {
    const id = req.params.id
    res.send(`Producto con id: ${id}`)
}


async function deleteProductByID(req, res) {
    try {
        const id = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send({ message: "Producto no encontrado." });
        }

        res.status(200).send({
            message: "Producto eliminado correctamente",
            product: deletedProduct
        });

    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

async function updateProductByID(req, res) {
    try {
        const id = req.params.id
        const updates = req.body

        if(req.fileData.filename) {
            updates.image = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/products/${req.fileData.filename}`
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true })

        if(!updatedProduct) {
            return res.status(404).send({message: "Producto no encontrado."})
        }

        res.status(200).send({
            message: `Producto con id: ${id} actualizado correctamente`,
            product: updatedProduct
        })

    } catch (error) {
        console.error("Error al actualizar: ", error)
        res.status(500).send({ message: "Error interno del servidor" })
    }
}

module.exports = {
    getProducts,
    getProductByID,
    createProduct,
    deleteProductByID,
    updateProductByID
}