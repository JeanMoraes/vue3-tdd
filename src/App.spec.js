import { screen, render} from "@testing-library/vue"
import App from './App.vue'
import i18n from "./locale/i18n"
import router from "./routes/router"

import { setupServer } from 'msw/node'
import { rest } from 'msw'

import userEvent from "@testing-library/user-event"

const server = setupServer(
    rest.get('/api/1.0/users', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            content: [
                { id: 1, username: 'user-in-list', email: 'user-in-list@mail.com', image: null },
            ],
            page: 0,
            size: 0,
            totalPages: 0
        }))
    })
);

beforeAll(() => server.listen())
beforeEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

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

    it('Não exibir a página SignUpPage no endereço /', async () => {
        await setup('/')
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

    it('Navegando para a página do usuário após clicar no usuário na lista de usuários', async () => {
        await setup('/')
        const user = await screen.findByText('user-in-list')
        await userEvent.click(user)
        const page = await screen.findByTestId('user-page')
        expect(page).toBeInTheDocument()
    })
})