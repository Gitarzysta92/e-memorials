
module.exports = api => ({ 
	pages: require('./pages')(api), 
	partners: require('./partners')(api),
	users: require('./users')(api),
})

