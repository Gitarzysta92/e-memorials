const nodemailer = require('nodemailer');


module.exports = function(smtp) {
	const { host, port, secure, auth } = smtp;
	if (!(host && port && secure && auth)) return;
	const transporter = nodemailer.createTransport({ host, port, secure, auth });
	return async function({from, to, subject, text, ...rest}) {
		return await transporter.sendMail({ from, to, subject, text });
	}
}