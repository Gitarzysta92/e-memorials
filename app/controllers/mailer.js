
module.exports = function({ api, services }) {
	//api
	const { domain } = api;

	// services
	const { registration } = services.user;
	const { sendMessage } = services.mailer;


	const userRegistrationNotify = function(user) {
		user.url = `${domain}/memorium/`;

		sendMessage('sign-up-confirmation', user.data);
		sendMessage('partnership-notify', { email: user.promoCode });
		sendMessage('administration-notify', user);
	}

	registration.subscribe(userRegistrationNotify);


	const sendContactFormMessage = function(req, res) {
		sendMessage('contact-form', req.body);
		res.send({'success': '200'})
	}

	return { sendContactFormMessage };
}
