const Product = require("../models/product.model")
// const { path } = require("../app")
const fs = require("fs")
const path = require("path")


async function createProduct(req, res) {
    try {

        console.log(req.body)
        console.log(req.file) // Para ver el archivo que se subió

        if(req.file) {
            req.body.image = req.file.path // Guardamos la ruta de la imagen en el body
        }

        const product = new Product(req.body)
        
        const newProduct = await product.save()

        return res.status(201).send({
            message: "Producto creado correctamente",
            product: newProduct
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error al crear el producto" })
    }
}


async function getProducts(req, res) {
    try {
        const products = await Product.find({})
        console.log(products)
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

        if (deletedProduct.image) {
            const imagePath = path.join(
                __dirname, 
                "../uploads/products", 
                deletedProduct.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Eliminar imagen del servidor
            }
        }

        // 3. Respuesta exitosa
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

        if(req.file) {
            updates.image = req.fileData.filename // Guardamos la ruta de la imagen en el body
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true })

        if(!updatedProduct) {
            return res.status(404).send({message: "Producto no encontrado."})
        }

        res.status(200).send({
            message: `Producto con id: ${id} actualizado correctamente`,
            product: updatedProduct
        })

        res.send(`Producto con id: ${id} actualizado:`)
    } catch (error) {
        
    }
}

module.exports = {
    getProducts,
    getProductByID,
    createProduct,
    deleteProductByID,
    updateProductByID
}