const mysql = require('mysql');
const database = mysql.createPool({
    connectionLimit: 10,
    host: "mn06.webd.pl",
    user: "atole44_admin",
    password: "tzqx44!@#",
    database: 'atole44_memo'
});

async function _execute(sql) {
    const connection = new Promise(function(resolve, reject) {
        database.query(sql, function(err, result) {
            if (err) reject(err);
            resolve(result);
        })
    });
    return connection;
}



// GET
module.exports.getPanelByID = function(panelID) {
    const query = `SELECT * FROM UserPanels WHERE panel_ID = '${panelID}'`;  
    return _execute(query).then(current => current.length > 0 ? current : false);;
}

module.exports.getProfileByURL = function(uniqueID) {
    const query = `SELECT * FROM UserPanels WHERE unique_ID = '${uniqueID}'`;  
    return _execute(query).then(current => current[0]);;
}


module.exports.getPanelByUserID = function(userID) {
    const query = `SELECT * FROM UserPanels WHERE user_ID = '${userID}'`; 
    return _execute(query).then(current => current[0]);
}

module.exports.getUserPassword = function(userEmail) {
    const query = `SELECT password FROM Users WHERE email = '${userEmail}'`;
    return _execute(query).then(current => current[0] ? current[0].password : false);
}

module.exports.isUserAlreadyExists = function(userEmail) {
    const query = `SELECT * FROM Users WHERE email = '${userEmail}'`;
    return _execute(query).then(current => current.length > 0 ? true : false);
}


module.exports.getUserID = function({username, password}) {
    const query = `SELECT User_ID FROM Users WHERE email ='${username}' AND password = '${password}'`;
    return _execute(query).then(current => current[0].User_ID);
}



// POST
module.exports.createNewUser = function(userData) {
    const {
        name, 
        surname,
        email, 
        password,
        phone,
        city,
        postalCode: post_code,
        street: adress, 
    } = userData;
    const query = `INSERT INTO Users (email, password, name, surname, phone, adress, city, post_code)
        VALUES ('${email}', '${password}', '${name}', '${surname}', '${phone}', '${adress}', '${city}', '${post_code}')`;
    return _execute(query);
}

module.exports.createNewProfile = function(panelData, userID, uniqueID) {
    const {
        name,
        birth,
        dead,
        sentence,
        text
    } = panelData;
    const query = `INSERT INTO UserPanels (user_ID, unique_ID, name, birth, dead, sentence, text)
        VALUES ('${userID}','${uniqueID}', '${name}', '${birth}', '${dead}', '${sentence}', '${text}')`;
    return  _execute(query);
}



const sql = `CREATE TABLE IF NOT EXISTS
    Attachments(
        attachment_ID INT(11) unsigned NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        PRIMARY KEY (attachment_ID)
    );

CREATE TABLE IF NOT EXISTS 
    Users(
        user_ID INT(11) unsigned NOT NULL AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        phone int(20) NOT NULL,
        adress VARCHAR(255),
        city VARCHAR(100),
        post_code CHAR(6),
        PRIMARY KEY (user_ID)
    );
 
        
CREATE TABLE IF NOT EXISTS 
    UserPanels(
        panel_ID INT(11) unsigned NOT NULL AUTO_INCREMENT,
        user_ID INT(11) unsigned NOT NULL UNIQUE,
        unique_ID VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL, 
        birth DATE NOT NULL,
        dead DATE NOT NULL, 
        sentence VARCHAR(510) NOT NULL,
        text LONGTEXT,
        private_key INT(11) NOT NULL,
        PRIMARY KEY (panel_ID),
        CONSTRAINT Users_ibfk_1 FOREIGN KEY (user_ID) REFERENCES Users (user_ID) ON DELETE CASCADE ON UPDATE CASCADE
    );
 
 CREATE TABLE IF NOT EXISTS
    AttachmentsMeta (
        panel_ID int(11) unsigned NOT NULL,
        attachment_ID int(11) unsigned NOT NULL,
        PRIMARY KEY (panel_id, attachment_id),
        CONSTRAINT Attachments_meta_ibfk_1 FOREIGN KEY (panel_ID) REFERENCES UserPanels (panel_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT Attachments_meta_ibfk_2 FOREIGN KEY (attachment_ID) REFERENCES Attachments (attachment_ID) ON DELETE CASCADE ON UPDATE CASCADE
    );

    `


    





