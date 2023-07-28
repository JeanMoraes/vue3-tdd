import UserList from './UserList.vue'

import { render, screen } from '@testing-library/vue';
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import userEvent from "@testing-library/user-event"

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
    { 'id': 1, 'username': 'user1', 'email': 'user1@mail.com', 'image': null },
    { 'id': 2, 'username': 'user2', 'email': 'user2@mail.com', 'image': null },
    { 'id': 3, 'username': 'user3', 'email': 'user3@mail.com', 'image': null },
    { 'id': 4, 'username': 'user4', 'email': 'user4@mail.com', 'image': null },
    { 'id': 5, 'username': 'user5', 'email': 'user5@mail.com', 'image': null },
    { 'id': 6, 'username': 'user6', 'email': 'user6@mail.com', 'image': null },
    { 'id': 7, 'username': 'user7', 'email': 'user7@mail.com', 'image': null },
]

describe('User List', () => {

    it('Exibindo 3 usuários na listagem', async () => {
        render(UserList)
        const users = await screen.findAllByText(/user/)
        expect(users.length).toBe(3)
    })

    it('Exibir o link para a próxima página da lista de usuários', async () => {
        render(UserList)
        await screen.findByText('user1')
        const nextPageLink = screen.queryByText('next')
        expect(nextPageLink).toBeInTheDocument()
    })

    it('Exibir a próxima página depois de clicar no link next >', async () => {
        render(UserList)
        await screen.findByText('user1')
        const nextPageLink = screen.queryByText('next')
        await userEvent.click(nextPageLink)
        const firstUserOnPage2 = await screen.findByText('user4')
        expect(firstUserOnPage2).toBeInTheDocument()
    })

    it('Ocultando o botão next na última página', async () => {
        render(UserList)
        await screen.findByText('user1')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user4')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user7')
        expect(screen.queryByText('next')).not.toBeInTheDocument()
    })

    it('Não exibir o botão previous na primeira página', async () => {
        render(UserList)
        await screen.findByText('user1')
       expect(screen.queryByText('previous')).not.toBeInTheDocument()
    })

    it('Exibir o botão previous na página 2', async () => {
        render(UserList)
        await screen.findByText('user1')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user4')
        expect(screen.queryByText('previous')).toBeInTheDocument()
    })

    it('Exibir a página anterior após clicar no botão previous', async () => {
        render(UserList)
        await screen.findByText('user1')
        await userEvent.click(screen.queryByText('next'))
        await screen.findByText('user4')
        await userEvent.click(screen.queryByText('previous'))
        const firstUserOnPage1 = await screen.findByText('user1')
        expect(firstUserOnPage1).toBeInTheDocument()
    })

    
})