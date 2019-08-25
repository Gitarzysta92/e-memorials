module.exports = function({ api, services }) {

	const { pages, user, attachments, customersProfiles } = services;


	const staticPage = async function(req, res, next) {
		const url = req.originalUrl;

		const page = await pages.getPageData(url, user.auth.isAuth(req));
		if (!page) return next();
		
		res.render(page.templateName, page.data);
	}

	const resetPasswordPage = async function(req, res) {

	}


	// Render user profile
	const userProfile = async function(req, res) {
		const [ id, code ] = req.params.id.split('&');

		const {
			userID, 
			private_key, 
			...userPanelModel 	
		} = await customersProfiles.getProfileData(id);

		const restrictionCode = private_key.toString();
		if (restrictionCode.length === 4 && restrictionCode !== code) {
			return res.redirect(`/memorium/${id}/auth`);
		}

		const pageName = 'user-profile';

		const data = pages.getPageData(req, {
			name: pageName,
			isAuthorized: req.user,
			toInject: [
				userPanelModel,
				await attachments.get(userID, ['avatar', 'image', 'document'])
			],
		});

		res.render(pageName, data);
	}

	// Render code auth page
	const userProfileCodeAuthPage = function(req, res) {
		const id = req.params.id;
		const pageName = 'code-auth';
		const data = pages.getPageData(req, {
			name: pageName,
			toInject: [
				{ profileID: id }
			]
		});

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
			customersProfiles.createNewProfile(id);
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
	const profilePreviewPage = function(req, res) {
		const preview = customersProfiles.getProfileDataPreview(res.params.id);

		const pageName = 'edit-profile'
		const data = pages.getPageData(req, {
			name: pageName,
			isAuthorized: req.user,
			toInject: [ preview, ...att]
		});

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