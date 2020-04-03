const express = require('express');

const dbRouter = require('../data/dbRouter');

const server = express();

server.use(express.json());

server.get('/', (req,res) =>{
    res.send(`
    <h2> My Routed API</h2>
    <p>API Server is Running!</p>`);
});

server.use('/api/posts', dbRouter);
module.exports = server;