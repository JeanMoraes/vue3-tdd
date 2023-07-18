import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: {
            signUp: 'Sign Up',
            username: 'Username',
            email: 'E-mail',
            password: 'Password',
            passwordRepeat: 'Password Repeat'
        },
        'pt-br': {
            signUp: 'Cadastre-se',
            username: 'Usuário',
            email: 'Email',
            password: 'Senha',
            passwordRepeat: 'Repita a senha'
        }
    }
})

export default i18n