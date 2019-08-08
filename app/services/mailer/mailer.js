const nodemailer = require('nodemailer');

const templates = [
	require('./messages/sign-up-confirmation'),
	require('./messages/administration-notify'),
	require('./messages/contact-form'),
	require('./messages/password-reset'),
	require('./messages/partnership-notify')
]

const smtpMailer = function(smtp) {
	const { host, port, secure, auth } = smtp;
	if (!(host && port && secure && auth)) return;
	const transporter = nodemailer.createTransport({ host, port, secure, auth });
	return async function({from, to, subject, text, ...rest}) {
		return await transporter.sendMail({ from, to, subject, text });
	}
}

module.exports = function({ mailer }) {

	const { sender, config } = mailer; 
	const messages = templates.map(tmpl => tmpl(sender));
	const send = smtpMailer(config);


	const sendMessage = function(tmplName, data) {
		const message = messages.find(msg => msg.hasOwnProperty(tmplName));
		console.log(message);
		send(message[tmplName](data))
	}

	return {
		sendMessage
	}
}





