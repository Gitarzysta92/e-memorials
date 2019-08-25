
module.exports = from => ({ 
  'administration-notify' :  (formData, url) => {
    const { 
      id = '',
      email = '', 
      name = '', 
      surname = '',
      phone = '',
      city = '',
      street = '',
      postalCode = '' } = formData;
    
    return {
      from: from,
      to: from,
      subject: `${name} <${email}> - nowy użytkownik`,
      text: `
  
      URL: ${url}${id}
  
      Pozostałe dane:
  
      Imię i nazwisko: ${name} ${surname}
      Adres e-mail: ${email}
      Telefon: ${phone}
      Miasto i kod pocztowy: ${city} ${postalCode}
      Ulica: ${street}
      
      Z poważaniem
      Memorium Immortalis
      `
    }
  }
})