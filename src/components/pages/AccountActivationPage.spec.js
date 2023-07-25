import AccountActivationPage from './AccountActivationPage.vue'
import { render, screen } from '@testing-library/vue'

import { setupServer } from "msw/node"
import { rest } from "msw"

const server = setupServer();

beforeAll(() => server.listen())
beforeEach(() => { server.resetHandlers() })
afterAll(() => server.close())

describe('Página de activação de conta', () => {

    const setup = (token) => {
        render(AccountActivationPage, {
            global: {
                mocks: {
                    $route: {
                        params: {
                            token: token
                        }
                    }
                }
            }
        })
    }

    let counter
    beforeEach(() => {
        counter = 0
        server.use(
            rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
                if(req.params.token === '5678') {
                    return res(ctx.status(400), ctx.json({ message: 'Activation is failure' }))
                }
                counter +=1
                return res(ctx.status(200))
            })
        )
    })

    it('exibir mensagem de sucesso quando o token estiver correto.', async () => {
        setup('1234')
        const message = await screen.findByText('Account is activated')
        expect(message).toBeInTheDocument()
    })

    it('enviando uma requisição de ativação ao backend', async () => {
        setup('1234')
        await screen.findByText('Account is activated')
        expect(counter).toBe(1)

    })

    it('exibir mensagem de erro quando o token estiver incorreto.', async () => {
        setup('5678')
        const message = await screen.findByText('Activation is failure')
        expect(message).toBeInTheDocument()
    })

    it('exibindo o spinner durante a chamada de ativação.', async () => {
        setup('1234')
        const spinner = await screen.findByRole('status')
        expect(spinner).toBeInTheDocument()
        await screen.findByText('Account is activated')
        expect(spinner).not.toBeInTheDocument()
    })
})