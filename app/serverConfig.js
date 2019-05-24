const fs = require('fs');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const exthbs = require('express-handlebars');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');



module.exports = function(expressInstance, dirs) {
    const server = expressInstance;
    const { layouts, partials } = dirs;
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(cookieParser());
    server.use(express.static('public/'));
    server.set('trust proxy', 1);
    server.set('view engine', 'hbs');

    server.engine('hbs', exthbs({
        extname: '.hbs',
        defaultLayout: 'default',
        layoutsDir: layouts,
        partialsDir: partials
    }));
    //server.use(logger('dev'));
    server.use(session({
        genid: (req) => uuid(),
        secret: 'asd',
        name: 'session',
        cookie: { 
            maxAge: 60000,
            domain: '127.0.0.1',
            httpOnly: false,
            secure: false
         },
        resave: false,
        saveUninitialized: false

    }));
    server.use(passport.initialize());
    server.use(passport.session());

    server.use(function(req, res, next) {
      //  console.log(req.cookies);
        next();
    });


	return server; 
}


