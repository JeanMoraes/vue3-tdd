import '@testing-library/jest-dom'
import i18n from '../src/locale/i18n'

afterEach(() => {
    i18n.global.locale = 'en'
})