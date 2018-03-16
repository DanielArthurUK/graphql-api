'use strict';

var _Schema = require('./Schema');

require('dotenv').config();
var util = require('util');

// DATABASE SETUP
var uri = "mongodb://ESRSAdmin:UniNinja@cluster0-shard-00-00-d1bwx.mongodb.net:27017,cluster0-shard-00-01-d1bwx.mongodb.net:27017,cluster0-shard-00-02-d1bwx.mongodb.net:27017/uni?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
var database = null;
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(uri, function (err, connection) {
  if (connection) {
    database = connection.db("UniNinjaDB");
  }
});

// GRAPHQL SETUP
var express = require('express');
var graphqlHTTP = require('express-graphql');
var app = express();

app.use('/graphql', graphqlHTTP({
  schema: _Schema.schema,
  graphiql: true
}));

// CURRENT LISTENER
app.get('/', function (req, res) {

  // BASIC USERNAME LISTENER
  if (req.query.username == "loic") {
    res.send('iOS > Android');
  } else if (req.query.username == "dan") {
    res.send('Android > iOS');
  } else {

    // DATABASE QUERY
    if (database) {
      database.collection("uni").find().toArray(function (err, dbRes) {
        if (err) console.log("Error");
        console.log(dbRes);
        res.send(dbRes);
      });

      // ELSE ERROR CONNECTING
    } else {
      res.send('Error connecting to database!');
    }
  }
});

// run server on port 3000
app.listen('3000', function (_) {
  return console.log('Server is listening on port 3000...');
});