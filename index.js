const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId
require('dotenv').config();


const app = express()
const port = 4500
app.use(cors())
app.use(express.json())


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxd1m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("foodStore").collection("data");
  const adminCollection = client.db("foodStore").collection("admin");
  const orderCollection = client.db("foodStore").collection("order");
  const reviewCollection = client.db("foodStore").collection("review");
    app.post('/addProduct',(req,res)=>{
        const product=req.body
        collection.insertOne(product)
        .then((document)=>{
            res.send(document.insertedCount > 0);
        })
    })
    app.get('/viewProduct',(req,res)=>{
        collection.find({})
        .toArray((error,document)=>{
            res.send(document)
        })
    })
  
    app.post('/addAdmin',(req,res)=>{
        const product=req.body
        adminCollection.insertOne(product)
        .then((document)=>{
            // console.log(document);
            res.send(document.insertedCount > 0);
        })
    })
    app.delete('/productDelete/:id',(req,res)=>{
        const id=req.params.id
        collection.deleteOne({_id:ObjectId(id)})
        .then((document)=>{
            res.send(document.deletedCount > 0)
        })
    })

    app.post('/singleProductOrder',(req,res)=>{
        const singleService=req.body
        // console.log(singleService);
        orderCollection.insertOne(singleService)
        .then((document)=>{
            // console.log(document);
            res.send(document.insertedCount > 0)
        })
    })
    app.get('/sigleProductshow/:id',(req,res)=>{
        const id=req.params.id
        collection.find({_id:ObjectId(id)})
        .toArray((error,document)=>{
            res.send(document)
        })
    })
    app.get('/orderLisht',(req,res)=>{
        const email=req.query.email
        
        adminCollection.find({admin:email})
        .toArray((error,adminDocument)=>{
            console.log(adminDocument);
            const filter={}
            if (adminDocument.length===0) {
                filter.email=email
            } 
            orderCollection.find(filter)
            .toArray((error,document)=>{
                res.send(document)
            })
        })
        
    })


    app.post('/reviewCollection',(req,res)=>{
        const product=req.body
        reviewCollection.insertOne(product)
        .then((document)=>{
            res.send(document.insertedCount > 0);
        })
    })
    app.get('/reviewCollectionView',(req,res)=>{
        reviewCollection.find({})
        .toArray((error,document)=>{
            res.send(document)
        })
    })

    
    app.post('/isAdmin',(req,res)=>{
        const email=req.body.email
        adminCollection.find({admin:email})
        .toArray((error,document)=>{
            res.send(document.length > 0);
        })
    })

});



app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
app.listen(process.env.PORT || port)