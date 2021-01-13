const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://maged:maged1991@cluster0.gmcfm.mongodb.net/<dbname>?retryWrites=true&w=majority'




MongoClient.connect(connectionString, {
    useUnifiedTopology: true },
    (err, client) => { if (err) return console.error(err)
    console.log('Connected to Database server')
    const db = client.db('star-wars-qoutes')
    const quotesCollections = db.collection('qoutes')

    // Midddlewares
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    
    app.use(bodyParser.json())

    app.use(express.static("public"));

    app.post('/quotes', (req, res) => {
        quotesCollections.insertOne(req.body)
        .then(res.redirect('/'))
        .catch(error => {console.error(error)})
    })
    
    app.get('/', (req, res) => {
        db.collection('qoutes').find().toArray()
        .then(result => {res.render('index.ejs', {quotes: result})})
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
        console.log(req.body)
        quotesCollections.findOneAndUpdate({
            name: 'Yoda',
        },
        { $set: 
            { 
                name: req.body.name, 
                quote: req.body.quote 
            } 
        },
        {
            upsert: true
        }
        )
        .then(result => console.log(result))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
        quotesCollections.deleteOne(
                {
                    name: req.body.name
                }
            )
            .then(result => res.json(`deleted dark vadar's quote`))
            .catch(error => console.error(error))
    })
    
})

app.listen(3000,  function(){
    console.log('Listening on port 3000');
})





//app.get(endpoint like '/', callback func)
//app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

