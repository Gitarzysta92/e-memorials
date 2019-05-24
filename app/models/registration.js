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
        name: 'Imię',
        surname: 'Nazwisko',
        email: 'Adres e-mail',
        password: 'Wybierz hasło',
        street: 'Ulica',
        city: 'Miasto',
        postalCode: 'Kod pocztowy',
        phone: 'Telefon',
        policy: {
            text: 'asasd',
            checked: false
        },
        button: {
            text: 'Wybierz pakiet',
            alt: false,
            url: false,
            meta: {
                class: 'solid blue',
                icon: false
            }
        },
        alert: false
    },
    helpers: {
        stepNumber: data => data,
    }
}