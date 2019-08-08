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
const fileUpload = require('express-fileupload');
const flash = require('express-flash-messages');


module.exports = function(expressInstance, dirs) {
    const server = expressInstance;
    const { layouts, partials } = dirs;
    server.use(cors());
    server.use(bodyParser.urlencoded({ 
        extended: false,
        limit: '50mb' 
    }));
    server.use(bodyParser.json({limit: '50mb'}));
    
    server.use(cookieParser('memo'));
    server.use(express.static('public/'));
    server.set('trust proxy', 1);
    server.set('view engine', 'hbs');
    server.use(flash())
    server.engine('hbs', exthbs({
        extname: '.hbs',
        defaultLayout: 'default',
        layoutsDir: layouts,
        partialsDir: partials
    }));
    //server.use(logger('dev'));
    server.use(session({
        genid: (req) => uuid(),
        secret: 'memo',
        name: 'session',
        cookie: { 
            maxAge: 600000,
            httpOnly: false,
            secure: false
         },
        resave: false,
        saveUninitialized: false

    }));
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/'
    }));
    
	return server; 
}


