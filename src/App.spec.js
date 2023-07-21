import { screen, render} from "@testing-library/vue"
import App from './App.vue'
import i18n from "./locale/i18n"

    // const setup = (path) => {
    //     window.history.pushState({}, "", path)

    //     render(App, {
    //         global: { plugins: [i18n]}
    //     })
    // }

describe('Roteamento', () => {

    it('exibindo a página Home no endereço /', () => {
        render(App, {
            global: { plugins: [i18n]}
        })
        const page = screen.queryByTestId('home-page')
        expect(page).toBeInTheDocument()
    })

    it('Não exibir a página SignUpPage no endereço /', () => {
        render(App, {
            global: { plugins: [i18n]}
        })
        const page = screen.queryByTestId('signup-page')
        expect(page).not.toBeInTheDocument()
    })

    // it('Exibir a página SignUpPage no endereço /signup', () => {
    //     window.history.pushState({}, "", "/signup")

    //     render(App, {
    //         global: { plugins: [i18n]}
    //     })
    //     const page = screen.queryByTestId('signup-page')
    //     expect(page).toBeInTheDocument()
    // })
})