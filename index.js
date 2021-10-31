const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const objectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lt029.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const run = async () => {
    try {
        await client.connect();
        const database = client.db('travel');
        const ordersCollection = database.collection('orders');
        const pakageCollection = database.collection('pakages');

        //get all the pakages
        app.get('/pakages', async (req, res) => {
            const result = await pakageCollection.find({}).toArray();
            res.send(result);
        })

        //get a single pakage 
        app.get('/pakages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await pakageCollection.findOne(query);
            res.send(result);
        })

        //post a single data to the database 
        app.post('/pakages', async (req, res) => {
            const data = req.body;
            const result = await pakageCollection.insertOne(data);
            res.send(result);
        });

        //Get all the orders
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        });
        //count if the element exists or not 
        app.get('/orders/count', async (req, res) => {

            const count = await ordersCollection.find(req.query).count();
            console.log(count);
            res.json(count);
        })
        //get a single order by id 
        app.get('/orders/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: id };
            const result = await ordersCollection.findOne(query);
            res.send(result);
        })

        //get all the orders by email
        app.get('/orders/email/:email', async (req, res) => {
            console.log('email')
            const email = req.params.email;
            const query = { email };
            const result = await ordersCollection.find(query).toArray();
            console.log(result);
            res.send(result);
        });

        //post the order
        app.post('/orders', async (req, res) => {
            const data = req.body;
            const result = await ordersCollection.insertOne(data);
            res.send(result);
        });
        //delete order by id 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('hello heroku');
});

app.listen(port, () => {
    console.log('listening to the port ', port);
});