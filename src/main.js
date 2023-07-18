import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: {
            signUp: 'Sign Up',
            username: 'Username',
            email: 'Email',
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

createApp(App).use(i18n).mount('#app')
