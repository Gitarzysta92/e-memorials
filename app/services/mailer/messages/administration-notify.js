
module.exports = from => ({ 
  'administration-notify' :  ({id, data, url}) => {
    const { 
      email = '', 
      name = '', 
      surname = '',
      phone = '',
      city = '',
      street = '',
      postalCode = '' } = data;
    
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