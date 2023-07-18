import { createI18n } from 'vue-i18n'
import en from "./en.json"
import ptBr from "./pt-br.json"

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: en,
        'pt-br': ptBr
    }
})

export default i18n