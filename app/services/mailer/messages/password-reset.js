
module.exports = from => ({ 
  'password-reset' : ({email, link}) => ({
    from: from,
		to: email,
		subject: `<${email}> - reset hasła`,
    text: `

		URL: ${link}

		Po kliknięciu w link powyżej zmień hasło.
		`
  })
})