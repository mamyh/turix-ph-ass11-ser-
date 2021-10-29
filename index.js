const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const app = express();
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lt029.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const run = async () => {
    await client.connect();
    const database = client.db('travel');
    const travelCollection = database.collection('users');


}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('hello heroku');
});

app.listen(port, () => {
    console.log('listening to the port ', port);
})

