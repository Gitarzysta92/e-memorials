module.exports = function({ api, services }) {

	const { pages, user, attachments, customersProfiles } = services;


	const staticPage = async function(req, res, next) {
		const url = req.originalUrl;

		const page = await pages.getPageData(url, user.auth.isAuth(req));
		if (!page) return next();
		
		res.render(page.templateName, page.data);
	}

	const resetPasswordPage = async function(req, res) {
		const id = req.params.id;
		const url = req.originalUrl;
		const { resetID } = user.lostPassword.getRequest(req.params.id) || {};

		if (!resetID) {
			res.render('404', {message: 'Cannot find the page'});
		}

		const pageName = 'reset-password';
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ { profileID: id }	]);
		res.cookie('reset-token', resetID, { maxAge: 100000 });
		res.render(pageName, data);
	}


	// Render user profile
	const userProfile = async function(req, res) {
		const [ id, code ] = req.params.id.split('&');
		const url = req.originalUrl;

		const { 
			userID, 
			data: userData,
			accessRestricted,
			...att 
		} = await customersProfiles.getProfileData(id, code) || {};

		if (accessRestricted) {
			return res.redirect(`/memorium/${id}/auth`);
		}

		const pageName = 'user-profile';
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ userData, att	]);
		res.render(pageName, data);
	}


	// Render code auth page
	const userProfileCodeAuthPage = async function(req, res) {
		const id = req.params.id;
		const url = req.originalUrl;

		const pageName = 'profile-code-auth';
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ { profileID: id }	]);
		res.render(pageName, data);
	}


	// Render user panel page
	const userPanel = async function(req, res) {
		const id = await customersProfiles.getProfileID(req.user);
		const url = req.originalUrl;

		const { 
			userID, 
			data: userData, 
			...att 
		} = await customersProfiles.getProfileData(id, null) || {};


		if (!userData) {
			const user = 	await customersProfiles.getUserID(req.user);
			customersProfiles.createNewProfile(user);
			return res.redirect('/memorium/edit-profile')
		};

	
		const pageName = 'user-panel'
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ userData, att	]);
		res.render(pageName, data);
	}


	// Render edit profile page
	const editProfile = async function(req, res) {
		const id = await customersProfiles.getProfileID(req.user);
		const url = req.originalUrl;

		const { 
			userID, 
			data: userData, 
			...att 
		} = await customersProfiles.getProfileData(id, null) || {};

		const pageName = 'edit-profile';
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ userData, att	]);
		res.render(pageName, data);
	}


	// Render profile preview page
	const profilePreviewPage = async function(req, res) {
		const url = req.originalUrl;
		const preview = customersProfiles.getProfileDataPreview(req.params.id);

		const pageName = 'user-profile'
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ preview	]);
		res.render(pageName, data);
	}

	return {
		staticPage,
		userProfile,
		userProfileCodeAuthPage,
		userPanel,
		editProfile,
		profilePreviewPage,
		resetPasswordPage
	}
}