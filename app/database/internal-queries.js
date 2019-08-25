
module.exports = function(_execute) {
    // GET
const getPanelByID = function(panelID) {
    return _getUserPanelBy('panel_ID', panelID).then(current => current.length > 0 ? current : false)
 }
 
 const getProfileByUniqueID = function(uniqueID) {
     return _getUserPanelBy('unique_ID', uniqueID).then(current => current[0]);
 }
 
 const getPanelByUserID = function(userID) {
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
 
 const getUserPassword = function(userEmail) {
     const query = `SELECT password FROM Users WHERE email = '${userEmail}'`;
     return _execute(query).then(current => current[0] ? current[0].password : false);
 }
 
 const isUserAlreadyExists = function(userEmail) {
     const query = `SELECT * FROM Users WHERE email = '${userEmail}'`;
     return _execute(query).then(current => current.length > 0 ? true : false);
 }
 
 
 const getUserID = function({username} = {}) {
     const query = `SELECT User_ID FROM Users WHERE email ='${username}'`;
     return _execute(query).then(current => current[0] ? current[0].User_ID : false);
 }

 const getUserUniqueID = function({username}) {
    const query = `SELECT unique_ID FROM Users WHERE email ='${username}'`;
    return _execute(query).then(current => current[0] ? current[0].User_ID : false);
}
 
 const getAttachments = async function(userID, type) {
     const metaQuery = `SELECT attachment_ID FROM AttachmentsMeta WHERE panel_ID ='${userID}'`;
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
 const createNewUser = function(userData) {
     const {
         name, 
         surname,
         email, 
         password,
         phone,
         city,
         postalCode: post_code,
         street: address, 
     } = userData;
     const query = `INSERT INTO Users (email, password, name, surname, phone, address, city, postCode)
         VALUES ('${email}', '${password}', '${name}', '${surname}', '${phone}', '${address}', '${city}', '${post_code}')`;
     return _execute(query);
 }
 
 const createNewProfile = function(panelData, userID, uniqueID) {
     const {
         name = '',
         birth = '',
         death = '',
         sentence = '',
         text = ''
     } = panelData;
     const query = `INSERT INTO UserPanels (user_ID, unique_ID, name, birth, death, sentence, text)
         VALUES ('${userID}','${uniqueID}', '${name}', '${birth}', '${death}', '${sentence}', '${text}')`;
     return  _execute(query).then(result => result.affectedRows > 0 ? true : false);
 }
 
 const updateUserProfile = function(panelData, userID) {
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
 
 
 
 const addAttachment = function(file, type, userID) {
     const { path, name, alt, title } = file;
     const attachmentQuery = `INSERT INTO Attachments (name, type, url) VALUES ('${name}','${type}', '${path}')`;
     return _execute(attachmentQuery).then(result => {
         const relationQuery = `INSERT INTO AttachmentsMeta (panel_ID, attachment_ID)
         VALUES ('${userID}', '${result.insertId}')`
         return _execute(relationQuery) 
     })
 }
 
 
 
 const changeUserPassword = function(username, password) {
     const query = `UPDATE Users SET password = '${password}' WHERE email = '${username}'`;
     return _execute(query).then(result => result.affectedRows > 0 ? true : false);
 }
 

 // Get all partners
const getPages = function() {
  const query = `SELECT * FROM Pages`;
  return _execute(query).then(current => current.length > 0 ? current : []);
}

const getPromoCode = function(email) {
    const query = `SELECT * FROM Partners WHERE email = '${email}'`
    return _execute(query).then(current => current.length > 0 ? current[0] : false);
}


 return {
    getPanelByID,
    getProfileByUniqueID,
    getPanelByUserID,
    getUserPassword,
    isUserAlreadyExists,
    getUserID,
    getUserUniqueID,
    createNewUser,
    createNewProfile,
    updateUserProfile,
    addAttachment,
    getAttachments,
	changeUserPassword,
    getPages,
    getPromoCode
 }
}





