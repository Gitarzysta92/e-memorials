
const confirmationContent = `Witamy!

Z poważaniem
Memorium Immortalis
`


module.exports = from => ({ 
  'sign-up-confirmation' :  (email, name) => ({
    from: from,
    to: email,
    subject: `${name}! Witaj na Memorium.pl `,
    text: confirmationContent
  })
})
