module.exports = {
    logged: {
        navItems: [
            {
                url: '/memorium/dashboard',
                title: 'Twój profil',
                text: 'Twój profil',
                meta: {
                    class: ''
                }
            },
            {
                url: '/qanda',
                title: 'Pytania i odpowiedzi',
                text: 'Pytania i odpowiedzi',
                meta: {
                    class: ''
                }
            },
        ],
        signOut: true
    },
    notLogged: {
        navItems: [
            {
                url: '/',
                title: 'Strona główna',
                text: 'Strona główna',
                meta: {
                    class: ''
                }
            },
            {
                url: '/login',
                title: 'Logowanie',
                text: 'Logowanie',
                meta: {
                    class: ''
                }
            },
            {
                url: '/registration',
                title: 'Rejestracja',
                text: 'Rejestracja',
                meta: {
                    class: ''
                }
            },
            {
                url: '/qanda',
                title: 'Pytania i odpowiedzi',
                text: 'Pytania i odpowiedzi',
                meta: {
                    class: ''
                }
            },
            {
                url: '/contact',
                title: 'Kontakt',
                text: 'Kontakt',
                meta: {
                    class: ''
                }
            },
        ],
        singOut: false
    }
}