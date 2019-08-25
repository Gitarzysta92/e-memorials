
const sql = `
CREATE TABLE IF NOT EXISTS
    Pages(
        page_ID INT(11) unsigned NOT NULL AUTO_INCREMENT,
        meta LONGTEXT NOT NULL,
        content LONGTEXT NOT NULL,
        PRIMARY KEY (page_ID)
    );

CREATE TABLE IF NOT EXISTS
    Partners(
        partner_ID INT(11) unsigned NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        postCode VARCHAR(255) NOT NULL,
        PRIMARY KEY (partner_ID)
    );

CREATE TABLE IF NOT EXISTS
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
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        regDate VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(100),
        postCode CHAR(6),
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


    




