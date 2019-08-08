
const content = `Witamy!

Uprzejmie informujemy, że ktoś w tym momencie skorzystał z państwa kodu promocyjnego. 
Kazde wykorzystanie kodu w danym miesiacu będzie podliczane I wypłacane na jego koniec. 
Jednorazowe użycie kodu to dla waszego zakladu pogrzebowego 50 zł.

Z poważaniem
Memorium Immortalis
`


module.exports = from => ({ 
  'partnership-notify' :  email => {    
    return {
      from: from,
		  to: email,
		  subject: `Twój kod promocyjny dla Memorium.pl został wykorzystany`,
		  text: content
    }
  }
})


