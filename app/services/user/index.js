
module.exports = api => ({ 
	registration: require('./registration')(api), 
	lostPassword: require('./lost-password')(api) 
})

