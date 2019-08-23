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


module.exports = function({modelComposer, database, ...rest}) {
	

	// Create new payment transaction using payment handler
	const getPageData = async function(url, isAuthorized) {

		const userAccess = isAuthorized ? 'signed' : 'unSigned'

		const pagesData = await database.getPages()
		.then(result => result.map(page => ({
			meta: JSON.parse(page.meta),
			content: JSON.parse(page.content),
		})))
		
		const menu = pagesData.reduce((acc, page) => {
				if (!Array.isArray(page.meta.menu)) return acc;	
				const isExist = page.meta.menu.find(access => access === userAccess);
				return isExist ? [...acc, page.meta] : acc
		}, [])
		const page = pagesData.find(page => page.meta.path === url);

		if (!page) return;
		
		const pageData = modelComposer.preparePageModel({ menu: menu, main: page.content });
		return pageData;
	}

	return {
		getPageData
	}
}




