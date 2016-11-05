/**
 *            index
 *
 * Created by marcusjwhelan on 11/5/16.
 *
 * Contact: marcus.j.whelan@gmail.com
 *
 */

// First thing to execute on the server. is this file

// main file

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express(); // instance of express
const router = require('./router'); // add our router
const mongoose = require('mongoose');

// DB setup --------------------------------------------------------
mongoose.connect('mongodb://localhost:auth/auth'); // creates a new db in mongodb called auth

// app setup -------------------------------------------------------
// all bout getting express the way we want
app.use(morgan('combined')); // logging framework. logs requests from clients
app.use(bodyParser.json({ type: '*/*'})); // parsing http requests to get json out of them
router(app); // add our router to the app

// server setup ----------------------------------------------------
// all about getting express to talk to the outside world
const port = process.env.PORT || 3090;
// create an http server that receives requests and forwards to our app.
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);