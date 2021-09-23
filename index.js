const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port =  process.env.PORT || 5000
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyzwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("superShop").collection("products");
  const ordersCollection = client.db("superShop").collection("orders");

  app.get('/products', (req, res) => {
    collection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})
// single product
app.get('/product/:id', (req, res) => {
  collection.find({_id: ObjectId(req.params.id)})
  .toArray( (err, documents) => {
      res.send(documents[0]);
  })
})
  // console.log('database connected', collection);
  app.post('/addProduct', (req, res) => {
    const file = req.files.file;
        const name = req.body.name;
        const wight = req.body.wight;
        const price = req.body.price;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        // const filePath = `${__dirname}/doctors/${file.name}`
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        doctorCollection.insertOne({ name, wight,price , image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
})
 app.delete('/delete/:id', (req,res)=>{
  // console.log(res,params.id);
   collection.deleteOne({_id: ObjectId(req.params.id)})
   .then(result =>{
    //  console.log(result.deletedCount);
     res.send(result.deletedCount > 0)
   })
 })


 app.post('/addOrders', (req, res) => {
  const order = req.body;

  ordersCollection.insertOne(order)
  .then(result => {
    // console.log('inserted count', result.insertedCount);
    res.send(result.insertedCount > 0)
  })
})
app.get('/order', (req, res) => {
  ordersCollection.find()
  .toArray((err, items) => {
      res.send(items)
  })
})
  // perform actions on the collection object
//   client.close();
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)