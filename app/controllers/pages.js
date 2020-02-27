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

	// Render code auth page
	const userProfileCodeAuthPage = async function(req, res) {
		const id = req.params.id;
		const url = req.originalUrl;

		const pageName = 'profile-code-auth';
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ { profileID: id }	]);
		res.render(pageName, data);
	}


	// Render user dashboard
	const userDashboard = async function(req, res) {
		let profilesData = await customersProfiles.getProfiles({ username: 'm.lukasiewicz92@gmail.com'});
		const url = req.originalUrl;
	
		for (let i = 0; i < profilesData.length; i++) {
			const avatar = await attachments.getAttachment(profilesData[i].panel_ID, 'avatar');
			avatar[0] && (profilesData[i].avatar = avatar[0].url)
		}

		const pageName = 'user-dashboard'
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ {profiles: profilesData}]);
		console.log(data);
		res.render(pageName, data);
	}


	// Render user profile
	const userProfile = async function(req, res) {
		const authUserId = await customersProfiles.getUserID(req.user);
		const [ id, code ] = req.params.id.split('&');
		const url = req.originalUrl;

		const { 
			userID,
			data: userData,
			accessRestricted,
			...att 
		} = await customersProfiles.getProfileData(id, code) || {};

		const isAuthUserProfile = (authUserId === userID); 

		if (accessRestricted && !isAuthUserProfile) {
			return res.redirect(`/memorium/${id}/auth`);
		}

		let pageName = 'user-profile';
		if (isAuthUserProfile) pageName = 'user-panel';

		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ userData, att	]);
		res.render(pageName, data);
	}
	

	// Render edit profile page
	const editProfile = async function(req, res) {
		const profiles = await customersProfiles.getProfiles(req.user);
		const profileId = req.params.id;
		const url = req.originalUrl;

		const isOwner = profiles.find(profile => profile.unique_ID === profileId);

		if (!isOwner) {
			return res.redirect(`/memorium/dashboard`);
		}

		const { 
			userID,
			uniqueID,
			data: userData, 
			...att 
		} = await customersProfiles.getProfileData(profileId, null) || {};

		const pageName = 'edit-profile';
		const { data } = await pages.getPageDataModel(url, user.auth.isAuth(req), [ {uniqueID}, userData, att	]);
		console.log(data);
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
		userDashboard,
		editProfile,
		profilePreviewPage,
		resetPasswordPage
	}
}