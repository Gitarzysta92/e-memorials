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