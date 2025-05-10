const Order = require('../models/order.model');
const Product = require('../models/product.model');

async function createOrder(req, res) {
    try {
        const data = req.body;
        const order = new Order(data);

        await checkOrderPrice(order.products)

        const newOrder = await order.save();
        return res.status(201).send({
            message: 'Orden creada con éxito',
            order: newOrder
        });
    } catch (error) {
        console.error(error);
        res.status(400).send('Error al crear la orden:', error.message);
    }
}

async function checkOrderPrice(products) {
    for(const item of products) {
        const productDB = await Product.findById(item.product);
        if(!productDB) {
            throw new Error('no se encontró el producto con ID: ' + item.product);
        }
        if(productDB.price !== item.price) {
            throw new Error(`Precio modificado: ${productDB.name}`);
        }

    }
}

// Funcion para checkear el precio total de la orden (pendiente)

async function getOrders(req, res) {
    try {

        const id = req.user._id;
        const user = req.user.role === "admin" ? {} : { user: id}

        const orders = await Order.find(user)                         
                                    .sort({ createdAt: -1 })
                                    .populate('user', "name email")
                                    .populate('products.product', "name image");
        res.status(200).send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las ordenes');
    }
}

module.exports = {
    createOrder,
    getOrders,
};