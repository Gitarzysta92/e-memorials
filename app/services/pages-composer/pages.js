const models = {
	'home': require('./models/home'),
	'qanda': require('./models/qanda'),
	'policy': require('./models/policy'),
	'contact': require('./models/contact'),
	'forgot-password': require('./models/forgot-pass'),
	'navigation': require('./models/navigation'),
	'user-profile': require('./models/panel-model'),
	'profile-code-auth': require('./models/profile-code-auth'),
	'registration': require('./models/registration'),
	'reset-password': require('./models/reset-pass'),
	'login': require('./models/sign-in'),
	'edit-profile' : {}
}


const signedInMenuItems = [
	{
		meta: {
			menu: ["signed"],
			menuPosition: 1,
			path: "/memorium/dashboard",
			title: "Dashboard"
		}
	}
	// {
	// 	meta: {
	// 		menu: ["signed"],
	// 		menuPosition: 2,
	// 		path: "/memorium/edit-profile",
	// 		title: "Edytuj profil"
	// 	}
	// }
]


module.exports = function({modelComposer, database, ...rest}) {
	

	// Prepare page data model with given data
	const getPageDataModel = async function(url, isAuthorized, data) {
		const userAccess = isAuthorized ? 'signed' : 'unSigned'

		const rawData = await database.getPages()
			.then(result => result.map(page => ({ meta: JSON.parse(page.meta)})));
		
		const pagesData = rawData.concat(signedInMenuItems);
		const menu = getMenuItems(pagesData, userAccess);

		const pageData = modelComposer.preparePageModel({ menu: menu, models: data });
		pageData.data.menu.navItems = setCurrentMenuItem(pageData.data.menu.navItems, url); 
		userAccess === 'signed' && (pageData.data.menu.signOut = true);

		return pageData;
	}


	// Prepare data for dynamic pages
	const getPageData = async function(url, isAuthorized) {
		const userAccess = isAuthorized ? 'signed' : 'unSigned'

		const rawData = await database.getPages()
		.then(result => result.map(page => ({
			meta: JSON.parse(page.meta),
			content: JSON.parse(page.content),
		})))
		
		const page = rawData.find(page => page.meta.path === url);

		if (!page) return;
		const pagesData = rawData.concat(signedInMenuItems);
		const menu = getMenuItems(pagesData, userAccess);
		const pageData = modelComposer.preparePageModel({ menu: menu, main: page.content });

		pageData.data.menu.navItems = setCurrentMenuItem(pageData.data.menu.navItems, url); 

		return pageData;
	}

	
	// Get menu items for given access level and sort it 
	function getMenuItems(pagesData, userAccess) {
		const menuItems = pagesData.reduce((acc, page) => {
			if (!Array.isArray(page.meta.menu)) return acc;	
			const isExist = page.meta.menu.find(access => access === userAccess);
			return isExist ? [...acc, page.meta] : acc
		}, [])

		return menuItems.sort((curr, next) => curr.menuPosition - next.menuPosition);
	}


	// Set actual menu item as active by given url
	function setCurrentMenuItem(menu, url) {
		const firstLevel = new RegExp('^' + url + '$', 'g');
		
		return menu.map(item => {
			firstLevel.test(item.path) && (item.class = 'active');
			return item;
		});
	}


	return {
		getPageData,
		getPageDataModel
	}
}







