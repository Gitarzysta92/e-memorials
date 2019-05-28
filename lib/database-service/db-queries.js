const userPanelModel = require('./panelModel');



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
    const sql = `CREATE TABLE IF NOT EXISTS 
        UserPanels (
            Panel_ID int(11) unsigned NOT NULL AUTO_INCREMENT,
            User_ID int(11) unsigned NOT NULL,
            Name VARCHAR(255) NOT NULL, 
            Birth DATE NOT NULL,
            Dead DATE NOT NULL, 
            Sentence VARCHAR(510) NOT NULL,
            Text LONGTEXT,
            PRIMARY KEY (Panel_ID),
            CONSTRAINT Users_ibfk_1 FOREIGN KEY User_ID REFERENCES Users (User_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        )`
    database.query(sql, function(err, result){
        if (err) throw err;
        console.log("Table created")
    });
});


const attachments = `CREATE TABLE IF NOT EXISTS
    Attachments (
        Attachment_ID int(11) unsigned NOT NULL AUTO_INCREMENT,
        Name VARCHAR(255) NOT NULL,
        Url VARCHAR(255) NOT NULL,
        PRIMARY KEY (Attachment_ID)
    )`


const attachmentsMeta = `CREATE TABLE IF NOT EXISTS
    AttachmentsMeta (
        Panel_ID int(11) unsigned NOT NULL,
        Attachment_ID int(11) unsigned NOT NULL,
        PRIMARY KEY (panel_id, attachment_id),
        KEY attachment_id,
        CONSTRAINT Attachments_meta_ibfk_1 FOREIGN KEY Panel_ID REFERENCES UserPanels (Panel_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT Attachments_meta_ibfk_2 FOREIGN KEY Attachment_ID REFERENCES Attachments (Attachment_ID) ON DELETE CASCADE ON UPDATE CASCADE
    )`


const user = `CREATE TABLE IF NOT EXISTS 
    Users (
        User_ID int(11) unsigned NOT NULL AUTO_INCREMENT,
        Email VARCHAR(100) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Name VARCHAR(100) NOT NULL,
        Surname VARCHAR(255) NOT NULL,
        Phone int(20) NOT NULL,
        Adress VARCHAR(255),
        City VARCHAR(100),
        Post_code CHAR(6),
        PRIMARY KEY (User_ID)
    )`













module.exports.getPageDataBy = function() {

}







