
module.exports = function({ api, services }) {
	const { registration } = services.user;
	const { sendMessage } = services.mailer;
	


	const userRegistrationNotify = function(user) {
		console.log(user);
	//	sendMessage('sign-up-confirmation', user.data);
	//	sendMessage('partnership-notify');
	//	sendMessage('administration-notify')
	}

	registration.subscribe(userRegistrationNotify);
}
