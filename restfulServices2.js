/* 
dit werkt in MongoDB, maar niet met deleteMany => geen aggregate functie:
db.getCollection('mijnenveger').deleteMany(
db.getCollection('mijnenveger')
.aggregate({$match: {"bommen":10,"rijen":10,"kolommen":10}},
{$sort:{"tijd":1}}, 
{$skip:3}))
 */

'use strict';

var app = require('express')();     /* server */
var mongoClient = require('mongodb').MongoClient;   /* communicatie mongodb */
var url = "mongodb://localhost:27017/test"; /* !! NIET http !! */
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/deelnemers', haalDeelnemerlijstOp);
// app.get('/naam', selecteerOpNaam);
// app.get('/config', selecteerOpConfig);
app.post('/nieuw', nieuweSpelerInvoegen);

function haalDeelnemerlijstOp(request, response) {
    var naam = '';
    var bommen = ""//10, rijen = 10, kolommen = 10;
    var query = naam ? { 'naam': naam } : bommen ? { 'bommen': bommen, 'rijen': rijen, 'kolommen': kolommen } : {};
    // var query = { 'naam': naam };

    mongoClient.connect(url, function (error, db) {
        console.log('connected to db');
        var collection = db.collection('mijnenveger');
        collection.find(query)
            .sort({ bommen: -1, kolommen: -1, rijen: -1, tijd: 1 })
            .toArray(function (err, docs) {
                console.log('deelnemerlijst gevonden');
                response.send(JSON.stringify(docs));
                var resultaat = JSON.stringify(docs);
                console.log(JSON.parse(resultaat));
                db.close;
            })
    })
}
function selecteerOpNaam(request, response) {
    console.log('selectie op naam');
}

function selecteerOpConfig(request, response) {
    console.log('selectie op config');
}

/* 3/config, orden tijd, push & pop */
function nieuweSpelerInvoegen(req, res) {
    // console.log('you are here');
    mongoClient.connect(url, function (err, db) {
        console.log('nieuwe invoer opgestart');
        var collection = db.collection('mijnenveger');
        console.log(collection)
        /* opvragen & vgl */
        var tijd = 70;
        var bommen = 10, rijen = 10, kolommen = 10;
        var query = { 'bommen': bommen, 'rijen': rijen, 'kolommen': kolommen };

        collection.insertOne({
            naam: req.body.naam,
            tijd: req.body.tijd,
            bommen: req.body.bommen,
            rijen: req.body.rijen,
            kolommen: req.body.kolommen,
        }, function (err, r) {
            console.log("toegevoegd: " + r.insertedCount);


        })
    })
};


app.listen(1111);

/* app.get('/', function (req, res) {
    res.send('Hello world');
})
app.listen(3000) */

/* 
opvragen top > configuratie >> top 3
limit 3
config inwerken > string 'bomxrijxkolom'
config inwerken > string  config (gekregen)
opvragen top 3 > opzoeken op naam
post conffig/speler
 */