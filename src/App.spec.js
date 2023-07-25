import { screen, render} from "@testing-library/vue"
import App from './App.vue'
import i18n from "./locale/i18n"
import router from "./routes/router"

import userEvent from "@testing-library/user-event"

const setup = async (path) => {
    render(App, {
        global: { plugins: [i18n, router]}
    })
    router.replace(path)
    await router.isReady()
}

describe('Roteamento', () => {

    it('exibindo a página Home no endereço /', async() => {
        await setup('/')
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

    it.each`
        initialPath     | clickingTo    | visiblePage
        ${'/'}          | ${'Sign Up'}  | ${'signup-page'}
        ${'/signup'}    | ${'Home'}     | ${'home-page'}
        ${'/'}          | ${'Login'}    | ${'login-page'}
    `('Exibir a página $visiblePage depois de clicar no link $clickingTo', 
        async ({initialPath, 
                clickingTo,
                visiblePage 
        }) => {
        await setup(initialPath)
        const link = screen.queryByRole('link', {name: clickingTo})
        await userEvent.click(link)

        const page = await screen.findByTestId(visiblePage)
        expect(page).toBeInTheDocument()
    })
})