const test = require('./test');
const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const app = express();

const testobj = { message: 'you were connected' };
//const db = test.MongoClientConnect();

//if (db.databaseName) console.log(db.databaseName);
//else console.log('NODE JS COULD NOT CONNECT TO DB');
const readyResponse = function (res) {
  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
  });
};
//////////////////////////////////////////////

app.get('', (req, res) => {
  console.log(req.query);

  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
  });
  res.write(JSON.stringify(testobj));
  res.end();
});
//////////////////////////////////////////////
app.get('/create', (req, res) => {
  console.log(req.query);
  if (!req.query.owner) {
    console.log('OWNER UNDEFINED');
    return;
  }
  req.query.pin = parseInt(req.query.pin);
  req.query.movements = [];
  req.query.movementsDates = [];
  req.query.interestRate = parseInt(1.0);

  test.MongoClientConnect(req.query);

  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
  });
  res.write(JSON.stringify(testobj));
  res.end();
});
//////////////////////////////////////////////
app.get('/login', async (req, res) => {
  let acc = {};
  readyResponse(res);
  console.log(req.query, 'query');
  if (!req.query.owner) {
    console.log('OWNER UNDEFINED');
    //res.write(JSON.stringify({ owner: 'FAILURE' }));
    //res.end();
    //return;
  } else {
    req.query.pin = parseInt(req.query.pin);

    acc = await test.MongoClientLogin(req.query);
    console.log(acc, 'printed again in else of /login');
  }

  res.write(JSON.stringify(acc));
  res.end();
});
/////////////////////////////////////////////////////
app.get('/close', async (req, res) => {
  readyResponse(res);
  console.log(req.query, 'query');

  req.query.pin = parseInt(req.query.pin);

  const acc = await test.MongoClientDelete(req.query);
  console.log(acc, 'printed in /close');

  res.write(JSON.stringify(acc));
  res.end();
});
///////////////////////////////////////////////////

app.get('/transfer', async (req, res) => {
  readyResponse(res);
  console.log(req.query, 'query');

  req.query.pin = parseInt(req.query.pin);

  const sender = await test.MongoClientLogin(req.query);
  console.log(sender, 'sender printed in /transfer');
  console.log(typeof `${sender._id}`, `${sender._id}`);

  try {
    const receiver = await test.MongoClientFinder(req.query.receiver);

    console.log(receiver, 'receiver in /transfer');
    const updatedSender = await test.MongoClientUpdate(
      sender,
      receiver,
      req.query
    );
    res.write(JSON.stringify(updatedSender));
    res.end();
  } catch (err) {
    console.log(err, 'receiver in /transfer');
    res.write(JSON.stringify(err));
    res.end();
  }
});
///////////////////////////////////////////////////

app.listen(3000, () => {
  console.log('Server is up on 3000');
});
clearInterval;
