import { screen, render} from "@testing-library/vue"
import App from './App.vue'
import i18n from "./locale/i18n"
import router from "./routes/router"
import store, { resetAuthState } from "./state/store"
import storage from "./state/storage"

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
    }),
    rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        const id = Number.parseInt(req.params.id);
        return res(
          ctx.status(200),
          ctx.json({
            id,
            username: `user${id}`,
            email: `user${id}@mail.com`,
            image: null,
          })
        );
      }),
    rest.post("/api/1.0/auth", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id: 5, username: "user5" }));
      })
);

beforeAll(() => server.listen())
beforeEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

const setup = async (path) => {
    render(App, {
        global: { plugins: [i18n, router, store]}
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

describe('Login', () => {

    afterEach(() => {
        storage.clear();
        resetAuthState()
    })

    const setupLogged = async () => {
        await setup('/login')
        await userEvent.type(screen.queryByLabelText('E-mail'), 'user5@mail.com')
        await userEvent.type(screen.queryByLabelText('Password'), 'P4ssword')
        await userEvent.click(screen.queryByRole('button', { name: 'Login'}))
    }

    it('Redirecionando para home após o login', async () => {
        await setupLogged()
        const page = await screen.findByTestId('home-page')
        expect(page).toBeInTheDocument()
    })

    it('Ocultar os botões de login e signup após o usuário logar', async () => {
        await setupLogged()
        await screen.findByTestId('home-page')
        const loginLink = screen.queryByRole('link', { name: 'Login'})
        const signUpLink = screen.queryByRole('link', { name: 'Sign Up'})
        expect(loginLink).not.toBeInTheDocument()
        expect(signUpLink).not.toBeInTheDocument()
    })

    it('Mostrar o link My Profile após o login', async () => {
        await setupLogged()
        await screen.findByTestId('home-page')
        const myProfileLink = screen.queryByRole('link', { name: 'My Profile'})
        expect(myProfileLink).toBeInTheDocument()
    })

    it('Exibir a página do usuário logado após clicar no link My Profile', async () => {
        await setupLogged()
        await screen.findByTestId('home-page')
        const myProfileLink = screen.queryByRole('link', { name: 'My Profile'})
        await userEvent.click(myProfileLink)
        await screen.findByTestId('user-page')
        const header = await screen.findByRole('heading', { name: 'user5'})

        expect(header).toBeInTheDocument()
    })

    it('Salvando as informações do usuário no localstorage', async () => {
        await setupLogged()
        await screen.findByTestId('home-page')

        const state = storage.getItem('auth')
        expect(state.isLoggedIn).toBeTruthy()
    })

    it('Exibir o layout quando estiver logado', async () => {
        storage.setItem('auth', { isLoggedIn: true })
        resetAuthState()
        await setup('/')
        const myProfileLink = screen.queryByRole('link', { name: 'My Profile'})
        expect(myProfileLink).toBeInTheDocument()
    })
})