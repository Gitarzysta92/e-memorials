const config = require('./smtp-config');
const mailer = require('../../lib/mail-sender/mailer');

const sender = mailer.configure(config);
const from = 'kontakt@memorium.pl';


module.exports.contactForm = function(formData) {
	const { 
		name = '', 
		surname = '', 
		email, 
		message = '' } = formData;
		
	if (!email) return; 
	
	console.log(sender);
	
	return sender({
		from: from,
		to: from,
		subject: `${name} <${email}> - przez formularz kontaktowy`,
		text: `od: ${name} ${surname} <${email}>
		${message}`
	}).catch(console.err);

} 



