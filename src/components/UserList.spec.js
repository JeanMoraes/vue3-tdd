import UserList from './UserList.vue'

import { render, screen } from '@testing-library/vue';
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import userEvent from "@testing-library/user-event"

import en from "../locale/en.json"
import i18n from "../locale/i18n";
import ptBr from "../locale/pt-br.json"

import LanguageSelector from './LanguageSelector.vue'

import router from "../routes/router"

const server = setupServer(
    rest.get('/api/1.0/users', (req, res, ctx) => {
        // api/1.0/users?page=0&size=3
        let page = Number.parseInt(req.url.searchParams.get('page'))
        let size = Number.parseInt(req.url.searchParams.get('size'))

        if(Number.isNaN(page)) page = 0
        if(Number.isNaN(size)) size = 5

        return res(ctx.status(200), ctx.json(getPage(page, size)))
    })
);

beforeAll(() => server.listen())
beforeEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

const getPage = (page, size) => {
    let start = page * size
    let end = start + size
    let totalPages = Math.ceil(users.length / size)

    return {
        content: users.slice(start, end),
        page,
        size,
        totalPages,
    }
}

const users = [
    { id: 1, username: 'user1', email: 'user1@mail.com', image: null },
    { id: 2, username: 'user2', email: 'user2@mail.com', image: null },
    { id: 3, username: 'user3', email: 'user3@mail.com', image: null },
    { id: 4, username: 'user4', email: 'user4@mail.com', image: null },
    { id: 5, username: 'user5', email: 'user5@mail.com', image: null },
    { id: 6, username: 'user6', email: 'user6@mail.com', image: null },
    { id: 7, username: 'user7', email: 'user7@mail.com', image: null },
]

const setup = async () => {
    const app = {
        components: {
            UserList,
            LanguageSelector
        },
        template: `
            <UserList />
            <LanguageSelector />
        `
    }

    render(app, {
        global: {
            plugins: [ router, i18n ]
        }
    })
    await router.isReady()
}

describe('User List', () => {

    it('Exibindo 3 usuários na listagem', async () => {
        await setup()
        const users = await screen.findAllByText(/user/)
        expect(users.length).toBe(3)
    })

    it('Exibir o link para a próxima página da lista de usuários', async () => {
        await setup()
        await screen.findByText('user1')
        const nextPageLink = screen.queryByText('next')
        expect(nextPageLink).toBeVisible()
    })

    it('Exibir a próxima página depois de clicar no link next >', async () => {
        await setup()
        await screen.findByText('user1')
        const nextPageLink = screen.queryByText('next')
        await userEvent.click(nextPageLink)
        const firstUserOnPage2 = await screen.findByText('user4')
        expect(firstUserOnPage2).toBeInTheDocument()
    })

    it('Ocultando o botão next na última página', async () => {
        await setup()
        await screen.findByText('user1')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user4')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user7')
        expect(screen.queryByText('next')).not.toBeVisible()
    })

    it('Não exibir o botão previous na primeira página', async () => {
        await setup()
        await screen.findByText('user1')
       expect(screen.queryByText('previous')).not.toBeVisible()
    })

    it('Exibir o botão previous na página 2', async () => {
        await setup()
        await screen.findByText('user1')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user4')
        expect(screen.queryByText('previous')).toBeVisible()
    })

    it('Exibir a página anterior após clicar no botão previous', async () => {
        await setup()
        await screen.findByText('user1')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user4')
        await userEvent.click(screen.queryByText('previous'))
        const firstUserOnPage1 = await screen.findByText('user1')
        expect(firstUserOnPage1).toBeVisible()
    })

    // it('Exibindo um indicativo de loading durante a chamada para a api', async () => {
    //     await setup()
    //     const spinner = screen.queryByRole('status')
    //     expect(spinner).toBeVisible()
    // })

    // it('Ocultar o indicativo de loading quando a chamada para a api terminar', async () => {
    //     await setup()
    //     const spinner = screen.queryByRole('status')
    //     await screen.findByText('user1')
    //     expect(spinner).not.toBeVisible()
    // })

    // it('Exibir o loading após clicar no botão next', async () => {
    //     await setup()
    //     await screen.findByText('user1')
    //     await userEvent.click(screen.queryByText('next'))
    //     const spinner = screen.queryByRole("status")
    //     expect(spinner).toBeInTheDocument()
    // })

})

describe('Internacionalização', () => {
    it('Exibir o cabeçalho e links em inglês inicialmente', async () => {
        await setup()
        await screen.findByText('user1')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user4')

        expect(screen.queryByText(en.users)).toBeInTheDocument()
        expect(screen.queryByText(en.nextPage)).toBeInTheDocument()
        expect(screen.queryByText(en.previousPage)).toBeInTheDocument()
    })

    it("Exibir o cabeçalho e os links em português após selecionar esse idioma", async () => {
        await setup()
        await screen.findByText('user1')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user4')
        const portugueseLanguageSelector = screen.queryByTitle("Português")
        
        await userEvent.click(portugueseLanguageSelector)
        expect(screen.queryByText(ptBr.users)).toBeInTheDocument()
        expect(screen.queryByText(ptBr.nextPage)).toBeInTheDocument()
        expect(screen.queryByText(ptBr.previousPage)).toBeInTheDocument()
    })
})