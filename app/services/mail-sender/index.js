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
	
	return sender({
		from: from,
		to: from,
		subject: `${name} <${email}> - przez formularz kontaktowy`,
		text: `od: ${name} ${surname} <${email}>
		treść wiadomości: ${message}`
	})
} 


const notifyContent = `Witamy!

Uprzejmie informujemy, że ktoś w tym momencie skorzystał z państwa kodu promocyjnego. 
Kazde wykorzystanie kodu w danym miesiacu będzie podliczane I wypłacane na jego koniec. 
Jednorazowe użycie kodu to dla waszego zakladu pogrzebowego 50 zł.

Z poważaniem
Memorium Immortalis
`

module.exports.notifyPromoCodeOwner = function(email) {
	if (!email) return;
	return sender({
		from: from,
		to: email,
		subject: `Twój kod promocyjny dla Memorium.pl został wykorzystany`,
		text: notifyContent
		
	})
}


const confirmationContent = `Witamy!

Z poważaniem
Memorium Immortalis
`

module.exports.signUpConfirmation = function(email, name) {
	if (!email) return;
	return sender({
		from: from,
		to: email,
		subject: `${name}! Witaj na Memorium.pl `,
		text: confirmationContent
	})	
}