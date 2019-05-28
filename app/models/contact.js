module.exports = {
    logo: {
        url: '/images/logo.png',
        alt: 'Company logo',
        title: 'e-memorials'
    },
    contact: {
        title: 'Masz jakieś pytanie? Napisz do nas!',
        text: `Miejsce gdzie możesz pielnęgnować 
        pamięć o bliskich, którzy odeszli.`
    },
    form: {
        name: 'Imię',
        surname: 'Nazwisko',
        email: 'Adres e-mail',
        textarea: 'Tutaj wpisz treść swojej wiadomości',
        button: {
            text: 'Wyślij wiadomość',
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