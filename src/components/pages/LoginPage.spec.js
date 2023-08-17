import { render, screen } from "@testing-library/vue"
import LoginPage from "./LoginPage.vue"
import userEvent from "@testing-library/user-event"

import { setupServer } from "msw/node"
import { rest } from "msw"

let requestBody, counter = 0;
const server = setupServer(
    rest.post("/api/1.0/auth", (req, res, ctx) => {
        requestBody = req.body
        counter += 1;
        return res(ctx.status(401), ctx.json({
            message: 'Incorrect credentials'
        }))
    })
);

beforeAll(() => server.listen())
beforeEach(() => {
    counter = 0;
    console.log(counter)
    server.resetHandlers()
})
afterAll(() => server.close())

let emailInput, passwordInput, button
const setup = async () => {
    render(LoginPage);
    emailInput = screen.queryByLabelText("E-mail");
    passwordInput = screen.queryByLabelText("Password");
    button = screen.queryByRole("button", { name: "Login"});
}

describe("LoginPage", () => {
    describe("Layout", () => {
        it("Exibir o cabeçalho na tela de login", async () => {
            await setup()

            const header = screen.queryByRole('heading', { name: "Login"})
            expect(header).toBeInTheDocument()
        })

        it("Testando campo de email", async () => {
            await setup();
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument()
        });

        it("Testando campo de senha", async () => {
            await setup();
            const input = screen.queryByLabelText("Password");
            expect(input).toBeInTheDocument()
        });

        it("Testando se o tipo do campo de senha é igual a password", async () => {
            await setup();
            const input = screen.queryByLabelText("Password");
            expect(input.type).toBe("password")
        });

        it("Testando o botão de logar", async () => {
            await setup();
            const button = screen.queryByRole("button", { name: "Login"});
            expect(button).toBeInTheDocument()
        });

        it("Testando se o botão de logar inicia desativado", async () => {
            await setup();
            const button = screen.queryByRole("button", { name: "Login"});
            expect(button).toBeDisabled()
        });
    })

    describe('Interações', () => {
        const setupFilled = async () => {
            await setup();
            await userEvent.type(emailInput, 'user100@mail.com')
            await userEvent.type(passwordInput, 'S3Nh4')
        }
        it('Ativar o botão de login quando o email e senha estiverem preenchidos', async () => {
           await setupFilled()
           expect(button).toBeEnabled()
        })

        // it('Exibir o loading após clicar no botão', async () => {
            // await setupFilled()
        //     expect(screen.queryByRole('oioio')).not.toBeInTheDocument()
        //     await userEvent.click(button)
        //     expect(screen.queryByRole('oioio')).toBeInTheDocument()
        // })

        it('Enviar email e senha para o backend', async () => {
            await setupFilled()
            await userEvent.click(button)
            expect(requestBody).toEqual({
                email: 'user100@mail.com',
                password: 'S3Nh4'
            })
        })

    //    it('Desativar o botão de enviar durante a chamada da api ', async () => {
    //         await setupFilled()
    //         await userEvent.click(button)
    //         await userEvent.click(button)

    //         expect(counter).toBe(1)
    //     })

        it('Exibir mensagem de erro para usuário inválido', async () => {
            await setupFilled()
            await userEvent.click(button)
            const errorMessage = await screen.findByText('Incorrect credentials')
            expect(errorMessage).toBeInTheDocument()
        })

        it('Remover a mensagem de erro para usuário inválido para o email for atualizado', async () => {
            await setupFilled()
            await userEvent.click(button)
            const errorMessage = await screen.findByText('Incorrect credentials')
            await userEvent.type(emailInput, 'novo@email.com')
            expect(errorMessage).not.toBeInTheDocument()
        })

        it('Remover a mensagem de erro para usuário inválido para a senha for atualizado', async () => {
            await setupFilled()
            await userEvent.click(button)
            const errorMessage = await screen.findByText('Incorrect credentials')
            await userEvent.type(passwordInput, 'N4v@')
            expect(errorMessage).not.toBeInTheDocument()
        })

    })
})