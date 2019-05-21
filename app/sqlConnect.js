const mysql = require('mysql');


const database = mysql.createConnection({
    host: "mn06.webd.pl",
    user: "atole44_admin",
    password: "tzqx44!@#",
    database: 'atole44_memo'
});

database.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
