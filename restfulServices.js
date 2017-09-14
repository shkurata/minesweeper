'use strict';

var app = require('express')(); /* server */
var mongoClient = require('mongodb').MongoClient; /* communicatie mongodb */
var url = "mongodb://localhost:27017/test"; /* !! NIET http !! */
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// enable cross domain calls (CORS = cross origin resource sharing)
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/deelnemers', haalDeelnemerlijstOp);
app.get('/namenlijst', haalNamenLijst);

app.get('/rijen', vulRijenIn);
app.get('/kolommen', vulKolommennIn);
app.get('/bommen', vulBommenIn);

app.post('/nieuw', nieuweSpelerInvoegen);

function haalNamenLijst(req, res) {
    mongoClient.connect(url, function(error, db) {
        console.log('connected to db');
        var collection = db.collection('mijnenveger');
        collection.distinct('naam', (function(err, docs) {
            console.log(docs);
            res.send(JSON.stringify(docs));
            db.close();
        }))
    })
}

function vulRijenIn(req, res) {
    mongoClient.connect(url, function(error, db) {
        console.log('connected to db');
        var collection = db.collection('mijnenveger');
        collection.distinct('rijen', (function(err, docs) {
            console.log(docs);
            res.send(docs);
            db.close();
        }))
    })
}

function vulKolommennIn(req, res) {
    var rij = +req.query.rij; // ok
    console.log("Dit is de rij in de restful: " + rij);
    mongoClient.connect(url, function(error, db) {
        console.log('connected to db');
        var collection = db.collection('mijnenveger');
        collection.aggregate({
            $match: { rijen: rij }
        }, {
            $group: { _id: '$kolommen' }
        }, function(err, docs) {
            console.log("Dit zijn de kolommen: " + JSON.stringify(docs));
            res.send(JSON.stringify(docs));
            db.close();
        })
    })
}

function vulBommenIn(req, res) {
    var rij = +req.query.rij;
    var kolom = +req.query.kolom;

    mongoClient.connect(url, function(error, db) {
        console.log('connected to db');
        var collection = db.collection('mijnenveger');
        collection.aggregate({
            $match: { rijen: rij, kolommen: kolom }
        }, {
            $group: { _id: '$bommen' }
        }, function(err, docs) {
            // console.log(docs);
            res.send(JSON.stringify(docs));
            db.close();
        })
    })
}

function haalDeelnemerlijstOp(request, response) {

    console.log(request.query.naam)
    var naam = request.query.naam;
    var bommen = +request.query.bommen,
        rijen = +request.query.rijen,
        kolommen = +request.query.kolommen;

    var query = {};
    if (naam && bommen) {
        query = { 'naam': new RegExp(naam, "i"), 'bommen': bommen, 'rijen': rijen, 'kolommen': kolommen };
    } else {
        if (naam) {
            query = { 'naam': new RegExp(naam, "i") };
        } else if (bommen) {
            query = { 'bommen': bommen, 'rijen': rijen, 'kolommen': kolommen };
        }
    }

    mongoClient.connect(url, function(error, db) {
        console.log('connected to db');
        var collection = db.collection('mijnenveger');
        collection.find(query)
            .sort({ bommen: -1, kolommen: -1, rijen: -1, tijd: 1 })
            .toArray(function(err, docs) {
                console.log('deelnemerlijst gevonden');
                response.send(JSON.stringify(docs));
                db.close;
            })
    })
}

/* 3/config, orden tijd, push & pop */
function nieuweSpelerInvoegen(req, res) {
    // console.log('you are here');
    mongoClient.connect(url, function(err, db) {
        console.log('nieuwe invoer opgestart');
        console.log(req.body.naam);
        var collection = db.collection('mijnenveger');
        collection.insertOne({
            naam: req.body.naam,
            tijd: +req.body.tijd,
            bommen: +req.body.bommen,
            rijen: +req.body.rijen,
            kolommen: +req.body.kolommen
        }, function(err, r) {
            console.log("tijdelijk toegevoegd");
            var melding;
            if (!err) {
                var bommen = +req.body.bommen,
                    rijen = +req.body.rijen,
                    kolommen = +req.body.kolommen;
                var query = { 'bommen': bommen, 'rijen': rijen, 'kolommen': kolommen };
                collection.find(query).sort({ tijd: -1 }).toArray(function(err, docs) {
                    if (!err) {
                        if (docs.length > 3) {
                            if (+req.body.tijd < docs[0].tijd) {
                                melding = "Je staat in de top 3";
                            } else {
                                melding = "Helaas... je staat niet in de top 3";
                            }
                            collection.deleteOne(docs[0], function(err, r) {
                                if (!err) {
                                    res.end(JSON.stringify(melding));
                                } else {
                                    melding = "Er is iets foutgelopen bij het aanpassen van de nieuwe top 3";
                                    res.end(JSON.stringify(melding));
                                    console.log('error: ' + err);
                                }
                                db.close();
                            })
                        } else {
                            melding = "Je staat in de top 3";
                            res.end(JSON.stringify(melding));
                        }
                    } else {
                        melding = "Er is iets foutgelopen bij het opvragen van de nieuwe top3";
                        res.end(JSON.stringify(melding));
                        console.log('error: ' + err)
                        db.close();
                    }
                });
            } else {
                melding = "Er is iets foutgelopen bij het toevoegen aan de top3";
                res.end(JSON.stringify(melding));
                console.log('error: ' + err);
                db.close();
            }
        })
    })
}

app.listen(1111);