"use strict";
// Importing dotenv to be used only in development
// Heroku has NODE_ENV = 'production' so will not require dotenv
if (process.env.NODE_ENV === 'development') require('dotenv').config();

process.title = 'node-chat';

var webSocketServerPort = process.env.PORT || 1337;
