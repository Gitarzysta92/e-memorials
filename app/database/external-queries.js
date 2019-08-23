
module.exports = function(_execute) {
    //
    // User profiles
    //
    const users = {
        // Create new user
        createUser: function(data) {
            const { name, surname, email, password, type, regDate, phone, city, postCode, address } = data;
            const query = `INSERT INTO Users (name, surname, email, password, type, regDate, phone, city, postCode, address)
                VALUES ('${name}', '${surname}', '${email}', '${password}', '${type}', '${regDate}', '${phone}', '${city}', '${postCode}', '${address}')`;
            return _execute(query).then(result => result.affectedRows > 0 ? true : false);
        },

        // Get all users profiles
        getUsersData: function() {
            const query = `SELECT * FROM Users`;
            return _execute(query).then(current => current.length > 0 ? current : []);
        },

        // Get user profile by given id 
        getUserDataById: function(id) {
            const query = `SELECT * FROM Users WHERE User_ID = '${id}'`;
            return _execute(query).then(current => current[0] ? current[0] : false);
        },

        // Update user profile by given id
        updateUserDataById: function(id, data) {
            const { name, surname, email, password, type, regDate, phone, city, postCode, address } = data;
            const query = `Update Users SET
                name = '${name}', surname = '${surname}', email = '${email}', password = '${password}', type = '${type}', regdate = '${regDate}', phone = '${phone}', city = '${city}', postCode = '${postCode}', address = '${address}'
                WHERE user_ID = ${id}`;
            return _execute(query).then(result => result.affectedRows > 0 ? true : false);
        },

        // Delete user by given id
        deleteUserById: function(id) {
            const query = `DELETE FROM Users WHERE user_ID = '${id}'`;
            return _execute(query).then(current => result.affectedRows > 0 ? true : false);
        }    
    }

    //
    // Partners
    //
    const partners = {
        // Create new partner
        createPartner: function(data) {
            const { name, email, address, city, postCode } = data;
            const query = `INSERT INTO Partners (name, email, address, city, postCode)
                VALUES ('${name}', '${email}', '${address}', '${city}', '${postCode}')`;
            return _execute(query).then(result => result.affectedRows > 0 ? true : false);
        },

        // Get all partners
        getPartnersData: function() {
            const query = `SELECT * FROM Partners`;
            return _execute(query).then(current => current.length > 0 ? current : []);
        },

        // Get partner by given id 
        getPartnerDataById: function(id) {
            const query = `SELECT * FROM Partners WHERE partner_ID = '${id}'`;
            return _execute(query).then(current => current[0] ? current[0] : false);
        },

        // Update user profile by given id
        updatePartnerDataById: function(id, data) {
            const { name, email, address, city, postCode } = data;
            const query = `Update Partners SET
                name = '${name}', email = '${email}', address = '${address}', city = '${city}', postCode = '${postCode}'
                WHERE partner_ID = ${id}`;
            return _execute(query).then(result => result.affectedRows > 0 ? true : false);
        },

        // Delete user by given id
        deletePartnerById: function(id) {
            const query = `DELETE FROM Partners WHERE partner_ID = '${id}'`;
            return _execute(query).then(result => result.affectedRows > 0 ? true : false);
        }    
    }
    
    //
    // Pages
    //
    const pages = {
        // Create new partner
        createPage: function(data) {
            const { meta, content } = data;
            const query = `INSERT INTO Pages (meta, content)
                VALUES ('${JSON.stringify(meta)}', '${JSON.stringify(content)}')`;
            return _execute(query).then(result => result.affectedRows > 0 ? true : false);
        },

        // Get all partners
        getPages: function() {
            const query = `SELECT * FROM Pages`;
            return _execute(query).then(current => current.length > 0 ? current : []);
        },

        // Get partner by given id 
        getPageById: function(id) {
            const query = `SELECT * FROM Pages WHERE page_ID = '${id}'`;
            return _execute(query).then(current => current[0] ? current[0] : false);
        },

        // Update user profile by given id
        updatePageById: function(id, data) {
            const { meta, content } = data;
            const query = `Update Pages SET
                meta = '${JSON.stringify(meta)}', content = '${JSON.stringify(content)}'
                WHERE page_ID = ${id}`;

            return _execute(query).then(result => result.affectedRows > 0 ? true : false);
        },

        // Delete user by given id
        deletePageById: function(id) {
            const query = `DELETE FROM Pages WHERE page_ID = '${id}'`;
            return _execute(query).then(result => result.affectedRows > 0 ? true : false);
        } 
    }
    
return { users, partners, pages };
}