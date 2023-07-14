import SignUpPage from "./SignUpPage.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
// import axios from "axios"
import { setupServer } from "msw/node"
import { rest } from "msw"

describe("SignUp Page", () => {
    describe("Layout", () => {
        it("Testando o Header", () => {
            render(SignUpPage);
            const header = screen.queryByRole("heading", { name: "Sign Up"});
            expect(header).toBeInTheDocument()
        });

        it("Testando campo de usuário", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Username");
            expect(input).toBeInTheDocument()
        });

        it("Testando campo de email", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument()
        });

        it("Testando campo de senha", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Password");
            expect(input).toBeInTheDocument()
        });

        it("Testando campo de repetir a senha", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Password Repeat");
            expect(input).toBeInTheDocument()
        });

        it("Testando o botão de enviar", () => {
            render(SignUpPage);
            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeInTheDocument()
        });

        it("Testando se o botão de enviar inicia desativado", () => {
            render(SignUpPage);
            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeDisabled()
        });
    })

    describe('Interações', () => {
        let requestBody
        let counter = 0
        const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {
                requestBody = req.body;
                counter += 1
                return res(ctx.status(200))
            })
        );

        beforeAll(() => server.listen())
        beforeEach(() => {
            counter = 0;
            server.resetHandlers()
        })
        afterAll(() => server.close())

        let button;

        const setup = async () => {
            render(SignUpPage);
            const usernamedInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            const passwordInput = screen.queryByLabelText("Password");
            const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
            button = screen.queryByRole("button", { name: "Sign Up"});
            await userEvent.type(usernamedInput, 'user1')
            await userEvent.type(emailInput, 'user1@email.com')
            await userEvent.type(passwordInput, 'S3nh4')
            await userEvent.type(passwordRepeatInput, 'S3nh4')
        }

        it("Ativando o botão de enviar quando os campos de senha estiverem preenchidos com o mesmo valor", async () => {
            await setup()
            
            expect(button).toBeEnabled()
        });

        it("Enviando username, email e senha para o backend", async () => {
            await setup()
            await userEvent.click(button)
            await screen.findByText("Please check your e-mail to active your account")

            expect(requestBody).toEqual({
                username: 'user1',
                email: 'user1@email.com',
                password: 'S3nh4'
            })
        })

        it("Não permitir o clique no botão de enviar durante a chamada da api", async () => {
            await setup()
            await userEvent.click(button)
            await userEvent.click(button)

            expect(counter).toBe(1)
           
        })

        it("Não exibir o loading do api quando não tiver uma requisição", async () => {
            await setup()
            const spinner = screen.queryByRole("status")
            expect(spinner).not.toBeInTheDocument()
        })

        it("Mostrando a mensagem de ativação após o sucesso para a criação do usuário", async () => {
            await setup()           
            await userEvent.click(button)

            const text = await screen.findByText("Please check your e-mail to active your account")
            expect(text).toBeInTheDocument()
        })
        

        it("Não exibir a mensagem de ativação antes de receber o sucesso ao enviar o formulário", async () => {
            await setup()

            const text = screen.queryByText("Please check your e-mail to active your account")
            expect(text).not.toBeInTheDocument()
           
        })

        it("não mostrar a mensagem caso tenha falha", async () => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res(ctx.status(400))
                })
            )
            await setup()
            // const button = screen.queryByRole("button", { name: "Sign Up"});
            await userEvent.click(button)

            const text = screen.queryByText("Please check your e-mail to active your account")
            expect(text).not.toBeInTheDocument()
        })

        it("Ocultando o formulário após o sucesso do formulário", async () => {
            await setup()
            const form = screen.queryByTestId("form-sign-up")

            await userEvent.click(button)

            await waitFor(() => {
                expect(form).not.toBeInTheDocument()
            })
        })

        it("exibindo mensagens de validação para os campos", async () => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res(ctx.status(400), ctx.json({
                        validationErrors: {
                            username: 'Username cannot be null'
                        },
                    }))
                })
            )
            await setup()
            await userEvent.click(button)

            const text = await screen.findByText("Username cannot be null")
            expect(text).toBeInTheDocument()
        })
    })
})