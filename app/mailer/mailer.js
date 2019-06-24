const { 
	mailer: send, 
	sender: from 
} = require('../api-provider');

//------
module.exports.contactForm = function(formData) {
	const { 
		name = '', 
		surname = '', 
		email, 
		message = '' } = formData;
		
	if (!email) return; 
	
	return send({
		from: from,
		to: from,
		subject: `${name} <${email}> - przez formularz kontaktowy`,
		text: `od: ${name} ${surname} <${email}>
		treść wiadomości: ${message}`
	})
} 

//------
const notifyContent = `Witamy!

Uprzejmie informujemy, że ktoś w tym momencie skorzystał z państwa kodu promocyjnego. 
Kazde wykorzystanie kodu w danym miesiacu będzie podliczane I wypłacane na jego koniec. 
Jednorazowe użycie kodu to dla waszego zakladu pogrzebowego 50 zł.

Z poważaniem
Memorium Immortalis
`

module.exports.notifyPromoCodeOwner = function(email) {
	if (!email) return;
	return send({
		from: from,
		to: email,
		subject: `Twój kod promocyjny dla Memorium.pl został wykorzystany`,
		text: notifyContent
		
	})
}


//------
const confirmationContent = `Witamy!

Z poważaniem
Memorium Immortalis
`

module.exports.signUpConfirmation = function(email, name) {
	if (!email) return;
	return send({
		from: from,
		to: email,
		subject: `${name}! Witaj na Memorium.pl `,
		text: confirmationContent
	})	
}


//-----------
module.exports.notifyAdministration = function(formData) {
	console.log(formData)
	const { 
		id = '',
		email = '', 
		name = '', 
		surname = '',
		phone = '',
		city = '',
		street = '',
		postalCode = '' } = formData;

	return send({
		from: from,
		to: from,
		subject: `${name} <${email}> - nowy użytkownik`,
		text: `

		URL: http://memorium.pl/memorium/${id}

		Pozostałe dane:

		Imię i nazwisko: ${name} ${surname}
		Adres e-mail: ${email}
		Telefon: ${phone}
		Miasto i kod pocztowy: ${city} ${postalCode}
		Ulica: ${street}
		
		Z poważaniem
		Memorium Immortalis
		`
	})
}

//-----------
module.exports.sendResetPasswordLink = function(email, link) {
	return send({
		from: from,
		to: email,
		subject: `<${email}> - reset hasła`,
		text: `

		URL: ${link}

		Po kliknięciu w link powyżej zmień hasło.
		`
	})
}