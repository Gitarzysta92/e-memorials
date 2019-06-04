module.exports = {
    logo: {
        url: '/images/logo.png',
        alt: 'Company logo',
        title: 'e-memorials'
    },
    description: {
        text: `Miejsce gdzie możesz pielnęgnować 
        pamięć o bliskich, którzy odeszli.`,
        button: {
            url: '/qanda',
            title: 'Questions and answers',
            text: 'więcej informacji',
            meta: {
                class: 'outlined',
                icon: false
            }
        }
    },
    steps: [
        {
            number: '1',
            text: 'Stwórz profil'
        },	
        {
            number: '2',
            text: 'Dodaj zdjęcia i informacje'
        },
        {
            number: '3',
            text: 'Otrzymaj fizyczny kod QR'
        },
    ],
    button: {
        url: '/registration',
        title: 'Dodaj swojego bliskiego',
        text: 'Dodaj swojego bliskiego',
        meta: {
            class: 'solid',
            icon: '/images/icon_add.png'
        }

    },
    link: {
        pre: 'Masz już konto?',
        url: '/login',
        title: 'Masz już konto?',
        text: 'Zaloguj się'
    }
}