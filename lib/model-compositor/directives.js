const navigation = require('../../app/models/navigation');



// Depending on user type, provide proper navigation model
const userType = {
	signedIn: 'signed-in-user',
	unsignedIn: 'unsigned-in-user'
}

module.exports.getNavigationFor = function(user) {
	const nav = JSON.parse(JSON.stringify(navigation));
	const navModel = (user === userType.signedIn) ? 
		nav.logged : nav.notLogged;
	console.log(user,  userType.signedIn);
	return function(request, model) {
		return Object.assign(model, {navigation: navModel});
	}	
}


// Depending on current path, set "Active" class on matched navigation element
module.exports.setNavigationCurrentElement = function(byCssClass) {
	return function(request, model) {
		const activeClass = byCssClass;

		const { navigation } = model;
		const { path } = request;
		const navExists = navigation && 
			navigation.hasOwnProperty('navItems') &&
			Array.isArray(navigation.navItems) &&
			navigation.navItems.length > 0;

		if (!(navExists || path)) return;	
		const pathPart = '/' + path.split('/')[1];
		console.log(pathPart);
		const preparedNavItems = navigation.navItems.map(model => {
			const cssClass = model.meta.class;

			if (model.url ===  pathPart) {
				model.meta.class = cssClass.concat(' ', activeClass);
			}
			return model;
		})

		navigation.navItems = preparedNavItems;
		return Object.assign(model, navigation);
	}
}

	