const { database: _execute } = require('../api-provider');

// GET
module.exports.getPanelByID = function(panelID) {
   return _getUserPanelBy('panel_ID', panelID).then(current => current.length > 0 ? current : false)
}

module.exports.getProfileByUniqueID = function(uniqueID) {
    return _getUserPanelBy('unique_ID', uniqueID).then(current => current[0]);
}

module.exports.getPanelByUserID = function(userID) {
    return _getUserPanelBy('user_ID', userID).then(current => current[0]);
}


function _getUserPanelBy(colName, value) {
    const query = `SELECT name, 
    DATE_FORMAT(birth, '%Y-%m-%d') AS birth, 
    DATE_FORMAT(death, '%Y-%m-%d') AS death, 
    sentence, text, private_key, user_ID
    FROM UserPanels WHERE ${colName} = '${value}'`
    return _execute(query)
}

module.exports.getPanelMetaByUserID = function(userID) {
    const query = `SELECT panel_ID, unique_ID 
    FROM UserPanels WHERE user_ID = '${userID}'`
    return _execute(query).then(current => current[0] ? current[0] : false);
}




module.exports.getUserPassword = function(userEmail) {
    const query = `SELECT password FROM Users WHERE email = '${userEmail}'`;
    return _execute(query).then(current => current[0] ? current[0].password : false);
}

module.exports.isUserAlreadyExists = function(userEmail) {
    const query = `SELECT * FROM Users WHERE email = '${userEmail}'`;
    return _execute(query).then(current => current.length > 0 ? true : false);
}


module.exports.getUserID = function({username}) {
    const query = `SELECT User_ID FROM Users WHERE email ='${username}'`;
    return _execute(query).then(current => current[0] ? current[0].User_ID : false);
}

module.exports.getAttachments = async function(userID, type) {
    const query = `SELECT panel_ID FROM UserPanels WHERE user_ID = '${userID}'`
    const { panel_ID } = await _execute(query).then(current => current[0] ? current[0] : false);

    const metaQuery = `SELECT attachment_ID FROM AttachmentsMeta WHERE panel_ID ='${panel_ID}'`;
    const meta = await _execute(metaQuery)

    const ids = meta.reduce((acc, curr, index) => {
        const comma = index !== 0 ? ',' : '';
        if (!curr.hasOwnProperty('attachment_ID')) return '';
        return acc += `${comma}'${curr.attachment_ID}'`
    }, '');
    const attachmentsQuery = `SELECT * FROM Attachments WHERE attachment_ID IN (${ids})
    AND type = '${type}'`;
    
    return ids.length > 2 ? await _execute(attachmentsQuery) : false;
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
        death,
        sentence,
        text
    } = panelData;
    const query = `INSERT INTO UserPanels (user_ID, unique_ID, name, birth, death, sentence, text)
        VALUES ('${userID}','${uniqueID}', '${name}', '${birth}', '${death}', '${sentence}', '${text}')`;
    return  _execute(query);
}

module.exports.updateUserProfile = function(panelData, userID) {
    const {
        name,
        birth,
        death,
        sentence,
        text,
        private_key
    } = panelData;
    const query = `Update UserPanels SET
        name = '${name}', birth = '${birth}', death = '${death}', sentence = '${sentence}', text = '${text}', private_key = '${private_key}'
        WHERE user_ID = ${userID}`;
    return  _execute(query).then(result => result.affectedRows > 0 ? true : false);
}



module.exports.addAttachment = function(file, type, userID) {
    const { path, name, alt, title } = file;
    const attachmentQuery = `INSERT INTO Attachments (name, type, url) VALUES ('${name}','${type}', '${path}')`;
    return _execute(attachmentQuery).then(result => {
        const relationQuery = `INSERT INTO AttachmentsMeta (panel_ID, attachment_ID)
        VALUES ('${userID}', '${result.insertId}')`
        return _execute(relationQuery) 
    })
}



module.exports.changeUserPassword = function(username, password) {
    const query = `UPDATE Users SET password = '${password}' WHERE email = '${username}'`;
    return _execute(query).then(result => result.affectedRows > 0 ? true : false);
}


module.exports.changeUserPassword = function(username, password) {
    const query = `Update Users SET password = '${password}' WHERE email = '${username}'`;
    return _execute(query);
}



const sql = `CREATE TABLE IF NOT EXISTS
    Attachments(
        attachment_ID INT(11) unsigned NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        alt VARCHAR(255) NOT NULL,
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
        death DATE NOT NULL, 
        sentence VARCHAR(510) NOT NULL,
        text LONGTEXT,
        private_key VARCHAR(255),
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


    




