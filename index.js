const express = require('express')
const cors = require("cors");
const { MongoClient } = require('mongodb');


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

        // get products api 
        app.get('/products', async (req, res) => {
            const product = productCollection.find({});
            const products = await product.toArray();
            res.send(products);
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