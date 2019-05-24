module.exports = {
    logo: {
        url: '/images/logo.png',
        alt: 'Company logo',
        title: 'e-memorials'
    },
    description: {
        text: `Miejsce gdzie możesz pielnęgnować 
        pamięć o bliskich, którzy odeszli.`
    },
    form: {
        username: {
            placeholder: 'Adres e-mail',
        },
        password: {
            placeholder: 'Hasło'
        },
        button: {
            text: 'Zaloguj się',
            alt: false,
            url: false,
            meta: {
                class: 'solid blue',
                icon: false
            }
        },
        alert: false
    },
    link: {
        pre: 'Masz już konto?',
        url: 'test',
        title: 'test',
        text: 'Zaloguj się'
    },
    helpers: {
        stepNumber: data => data,
    }
}