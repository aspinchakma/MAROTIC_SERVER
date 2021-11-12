const express = require('express')
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yu5z2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();


        const database = client.db('marotic');
        const productCollection = database.collection('products');
        const reviewCollection = database.collection('reviews');
        const userCollection = database.collection('users');
        const orderCollection = database.collection('orders')

        // get products api 
        app.get('/products', async (req, res) => {
            const product = productCollection.find({});
            const products = await product.toArray();
            res.send(products);
        })
        // get customers review

        app.get('/reviews', async (req, res) => {
            const user = reviewCollection.find({});
            const users = await user.toArray();
            res.send(users)
        })

        // get single product details api

        app.get('/product/:id', async (req, res) => {
            const productId = req.params.id;
            const query = { _id: ObjectId(productId) };
            const product = await productCollection.findOne(query);
            res.send(product)

        })
        // post api for insert user

        app.post('/user', async (req, res) => {
            console.log(req.body);
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })


        // post api for orders

        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        // get api for get data 
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const order = orderCollection.find(query);
            const orders = await order.toArray();
            res.json(orders);
        })

        //orders delete
        app.delete('/orders/:orderId', async (req, res) => {
            const orderId = req.params.orderId;
            const query = { _id: ObjectId(orderId) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);

        })



        // manage all api
        app.get('/manageAll', async (req, res) => {
            const order = orderCollection.find({});
            const orders = await order.toArray();
            res.json(orders);

        })


        app.delete('/manageAll/:orderId', async (req, res) => {
            const orderId = req.params.orderId;
            const query = { _id: ObjectId(orderId) };

            const result = await orderCollection.deleteOne(query);
            res.send(result);

        })

        // update status
        app.put('/manageAll/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: 'shipped' } };
            const result = await orderCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.send(result);
        })


    }
    finally {
        // await client.close();
    }
}






run().catch(console.dir)






app.get('/', (req, res) => {
    res.send("hello bro, this is basic setup for you .")
})



app.listen(port, () => {
    console.log('I am listening port,', port)
})