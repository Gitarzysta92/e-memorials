module.exports = function({ api, services }) {

	const { pages } = services;

	// render static home page
	const home = function(req, res) {
		const pageName = 'home';
		const data = pages.getPageData(req, {name: pageName});

		res.render(pageName, data);
	}


	// render questions and answers page
	const qanda = function(req, res) {
		const pageName = 'qanda';

		const data = pages.getPageData(req, {
			name: pageName,
			isAuthorized: req.user
		});

		res.render(pageName, data);
	}


	// render policy page
	const policy = function(req, res) {
		const pageName = 'policy';

		const data = pages.getPageData(req, {
			name: pageName
		});

		res.render(pageName, data);
	}


	// render contact page
	const contact = function(req, res) {
		const pageName = 'contact';

		const data = pages.getPageData(req, {
			name: pageName
		});

		res.render(pageName, data);
	}


	// render login page
	const login = function(req, res) {
		const pageName = 'login';

		if (req.user) return res.redirect('/memorium');

		const data = pages.getPageData(req, {
			name: pageName
		});

		res.render(pageName, data);
	}


	// render registration page
	const registration = function(req, res) {
		const pageName = 'registration';

		const data = pages.getPageData(req, {
			name: pageName
		});

		res.render(pageName, data);
	}


	// render registration second step page
	const registrationSecondStep = function(req, res) {
		const pageName = 'registration-second-step';
		const modelName = 'registration';

		const data = pages.getPageData(req, {
			name: modelName
		});

		res.render(pageName, data);
	}

	// Render forgot password page
	const forgotPasswordPage = function(req, res) {
		const pageName = 'forgot-password';

		const data = pages.getPageData(req, {
			name: pageName
		});

		res.render(pageName, data);
	}

	// Render reset password page
	const resetPasswordPage = function(req, res) {
		const pageName = 'reset-password';

		const data = pages.getPageData(req, {
			name: pageName
		});
		res.cookie('reset-token', req.params.id, { maxAge: 100000 });
		res.render(pageName, data);
	}

	const {
		attachments,
		customersProfiles
	} = services;
	

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
		const { 
			userID, 
			data: userData, 
			...att 
		} = await customersProfiles.getProfileData(id, null);

		if (!userData) return res.redirect('/memorium/edit-profile');

		const pageName = 'user-profile'
		const data = pages.getPageData(req, {
			name: pageName,
			isAuthorized: req.user,
			toInject: [ userData, att]
		});
		res.render(pageName, data);
	}


	// Render edit profile page
	const editProfile = async function(req, res) {
		const id = await customersProfiles.getProfileID(req.user);
		const { 
			userID, 
			data: userData, 
			...att 
		} = await customersProfiles.getProfileData(id, null);

		const pageName = 'edit-profile';
		const data = pages.getPageData(req, {
			name: pageName,
			isAuthorized: req.user,
			toInject: [ userData, att]
		});
		console.log(data);
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
		home,
		qanda,
		policy,
		contact,
		login,
		registration,
		registrationSecondStep,
		forgotPasswordPage,
		resetPasswordPage,
		userProfile,
		userProfileCodeAuthPage,
		userPanel,
		editProfile,
		profilePreviewPage
	}
}