const Product = require("../models/product.model")
const fileUpload = require("../middlewares/uploadFile")


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


function deleteProductByID(req, res) {
    const id = req.params.id
    res.send(`Producto con id: ${id} eliminado`)
}

function updateProductByID(req, res) {
    const id = req.params.id
    const product = req.body
    res.send(`Producto con id: ${id} actualizado: ${product}`)
}

module.exports = {
    getProducts,
    getProductByID,
    createProduct,
    deleteProductByID,
    updateProductByID
}