
module.exports = from => ({ 
  'contact-form' :  (formData) => {
    const { 
      name = '', 
      surname = '', 
      email, 
      message = '' } = formData;
    
    return {
      from: from,
		  to: from,
		  subject: `${name} <${email}> - przez formularz kontaktowy`,
		  text: `od: ${name} ${surname} <${email}>
		  treść wiadomości: ${message}`
    }
  }
})

