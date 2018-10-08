"use strict";
// Importing dotenv to be used only in development
// Heroku has NODE_ENV = 'production' so will not require dotenv
if (process.env.NODE_ENV === 'development') require('dotenv').config();

const app = require('express')();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, './../client/')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + './../client/index.html'))
});

export default app;