const Order = require("../model/Order");
const axios = require('axios');
const {publishMessage} = require('../utils/rabbitMQ');
// const Product = require("../../product-service/model/Product");

const placeOrder = async (req, res) => {
    const { products } = req.body;
    try {
        let totalAmount = 0;
        const orderProducts = [];
        for(let i = 0; i < products.length; i++) {
            // const product = await Product.findById(products[i].productId);
            const response = await axios.get(`http://product-service:1235/api/products/getProduct/${products[i].productId}`);
            const product = response.data;
            if(!product) {
                return res.status(404).json({message: 'Product not found'});
            }
            if(product.stock < products[i].quantity) {
                return res.status(400).json({message: `Insufficient stock for product ${product.name}`});
            }
            const price = product.price * products[i].quantity;
            totalAmount += price;
            orderProducts.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                price: price
            });
        }
        const newOrder = new Order({
            userId: req.user.id,
            products: orderProducts,
            totalAmount
        });
        await newOrder.save();

        // Publish order to RabbitMQ
        await publishMessage('orderQueue', {
            type: 'ORDER_RESULT',
            status: 'SUCCESS',
            orderId: newOrder._id,
            userId: newOrder.userId,
            userEmail: req.user.email,
            products: newOrder.products,
            totalAmount: newOrder.totalAmount
        });

        res.status(201).json({message: 'Order placed successfully...', order: newOrder});
    } catch (error) {
        console.log("Error while placing order:",error);
        try {
            await publishMessage('orderQueue', {
                type: 'ORDER_RESULT',
                status: 'FAILURE',
                reason: error.message,
                userId: req.user?.id,
                userEmail: req.user?.email
            });
        } catch (pubErr) {
            console.error('Failed to publish failure event:', pubErr.message);
        }
        res.status(500).json({message: 'Failed to place order', error});
    }
}

module.exports = {placeOrder};