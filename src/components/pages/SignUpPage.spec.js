import SignUpPage from "./SignUpPage.vue";
import LanguageSelector from "../../components/LanguageSelector"
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event"
// import axios from "axios"
import { setupServer } from "msw/node"
import { rest } from "msw"
import i18n from "../../locale/i18n";
import en from "../../locale/en.json"
import ptBr from "../../locale/pt-br.json"

let requestBody
let counter = 0
let acceptLanguageHeader;
const server = setupServer(
    rest.post("/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1
        acceptLanguageHeader = req.headers.get('Accept-Language')
        return res(ctx.status(200))
    })
);

beforeAll(() => server.listen())
beforeEach(() => {
    counter = 0;
    server.resetHandlers()
})
afterAll(() => server.close())

describe("SignUp Page", () => {
    describe("Layout", () => {
        const setup = () => {
            render(SignUpPage, {
                global: {
                    plugins: [i18n]
                }
            });
        }

        it("Testando o Header", () => {
            setup();
            const header = screen.queryByRole("heading", { name: "Sign Up"});
            expect(header).toBeInTheDocument()
        });

        it("Testando campo de usuário", () => {
            setup();
            const input = screen.queryByLabelText("Username");
            expect(input).toBeInTheDocument()
        });

        it("Testando campo de email", () => {
            setup();
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument()
        });

        it("Testando campo de senha", () => {
            setup();
            const input = screen.queryByLabelText("Password");
            expect(input).toBeInTheDocument()
        });

        it("Testando se o tipo do campo de senha é igual a password", () => {
            setup();
            const input = screen.queryByLabelText("Password");
            expect(input.type).toBe("password")
        });

        it("Testando campo de repetir a senha", () => {
            setup();
            const input = screen.queryByLabelText("Password Repeat");
            expect(input).toBeInTheDocument()
        });

        it("Testando o botão de enviar", () => {
            setup();
            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeInTheDocument()
        });

        it("Testando se o botão de enviar inicia desativado", () => {
            setup();
            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeDisabled()
        });
    })

    describe('Interações', () => {
        let button, passwordInput, passwordRepeatInput, usernamedInput;

        const setup = async () => {
            render(SignUpPage, {
                global: {
                    plugins: [i18n]
                }
            });
            usernamedInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            passwordInput = screen.queryByLabelText("Password");
            passwordRepeatInput = screen.queryByLabelText("Password Repeat");
            button = screen.queryByRole("button", { name: "Sign Up"});
            await userEvent.type(usernamedInput, 'user1')
            await userEvent.type(emailInput, 'user1@email.com')
            await userEvent.type(passwordInput, 'S3nh4')
            await userEvent.type(passwordRepeatInput, 'S3nh4')
        }

        const generateValidationError = (field, message) => {
            return  rest.post("/api/1.0/users", (req, res, ctx) => {
                return res(ctx.status(400), ctx.json({
                    validationErrors: {
                        [field]: message
                    },
                }))
            })
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

        it.each`
            field           | message
            ${'username'}   | ${'Username cannot be null'}
            ${'email'}      | ${'E-mail cannot be null'}
            ${'password'}   | ${'Password cannot be null'}
        `("exibindo mensagens de validação para o input de $field", async ({field, message}) => {
            
            server.use(generateValidationError(field, message))
            await setup()
            await userEvent.click(button)

            const text = await screen.findByText(message)
            expect(text).toBeInTheDocument()
        })

        it("ocultando o spinner ao receber um erro da api", async () => {
            server.use(generateValidationError('username', 'Username cannot be null'))
            await setup()
            await userEvent.click(button)

            await screen.findByText("Username cannot be null")
            const spinner = screen.queryByRole('status')
            expect(spinner).not.toBeInTheDocument()
        })

        it("habilitanto o botão ao receber um erro da api", async () => {
            server.use(generateValidationError('username', 'Username cannot be null'))
            await setup()
            await userEvent.click(button)

            await screen.findByText("Username cannot be null")
            expect(button).toBeEnabled()
        })

        it('Exibindo mensagem de que as senhas digitadas são diferentes', async () => {
            await setup();
            await userEvent.type(passwordInput, 'S3nh4')
            await userEvent.type(passwordRepeatInput, 'S3nh4N0V4')

            const text = await screen.findByText('Password mismatch')
            expect(text).toBeInTheDocument()
        })

        it.each`
            field           | message                       | label
            ${'username'}   | ${'Username cannot be null'}  | ${'Username'}
            ${'email'}      | ${'E-mail cannot be null'}    | ${'E-mail'}
            ${'password'}   | ${'Password cannot be null'}  | ${'Password'}
        `("limpando os erros dos campos após o usuário alterar o valor do input $field", async ({field, message, label}) => {
            server.use(generateValidationError(field, message))
            await setup()
            await userEvent.click(button)

            const text = await screen.findByText(message)
            const input = screen.getByLabelText(label)
            await userEvent.type(input, 'novo texto')
            expect(text).not.toBeInTheDocument()
        })
    })

    describe('Internaciolização', () => {
        let portugueseLanguage, englishLanguage, username, email, password, passwordRepeat, button;

        const setup = () => {
            const app = {
                components: {
                    SignUpPage,
                    LanguageSelector
                },
                template: `
                    <SignUpPage />
                    <LanguageSelector />
                `
            }

            render(app, {
                global: {
                    plugins: [i18n]
                }
            })

            portugueseLanguage = screen.queryByTitle("Português")
            englishLanguage = screen.queryByTitle("English")
            username = screen.queryByLabelText(en.username)
            email = screen.queryByLabelText(en.email)
            password = screen.queryByLabelText(en.password)
            passwordRepeat = screen.queryByLabelText(en.passwordRepeat)
            button = screen.queryByRole("button", { name: en.signUp })
        }        

        it('Idioma inicial dos textos seja em inglês', async () => {
            setup()
            expect(screen.queryByRole("heading", {name: en.signUp })).toBeInTheDocument()
            expect(screen.queryByRole("button", {name: en.signUp })).toBeInTheDocument()

            expect(screen.queryByLabelText(en.username)).toBeInTheDocument()
            expect(screen.queryByLabelText(en.email)).toBeInTheDocument()
            expect(screen.queryByLabelText(en.password)).toBeInTheDocument()
            expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument()
        })

        it('exibir os textos em português depois de selecionarmos o idioma', async () => {
            setup()
            await userEvent.click(portugueseLanguage)

            expect(screen.queryByRole("heading", {name: ptBr.signUp })).toBeInTheDocument()
            expect(screen.queryByRole("button", {name: ptBr.signUp })).toBeInTheDocument()

            expect(screen.queryByLabelText(ptBr.username)).toBeInTheDocument()
            expect(screen.queryByLabelText(ptBr.email)).toBeInTheDocument()
            expect(screen.queryByLabelText(ptBr.password)).toBeInTheDocument()
            expect(screen.queryByLabelText(ptBr.passwordRepeat)).toBeInTheDocument()
        })

        it('exibir os textos em inglês depois de traduzirmos a página a partir do português', async () => {
            setup()
            await userEvent.click(portugueseLanguage)
            await userEvent.click(englishLanguage)

            expect(screen.queryByRole("heading", {name: en.signUp })).toBeInTheDocument()
            expect(screen.queryByRole("button", {name: en.signUp })).toBeInTheDocument()

            expect(screen.queryByLabelText(en.username)).toBeInTheDocument()
            expect(screen.queryByLabelText(en.email)).toBeInTheDocument()
            expect(screen.queryByLabelText(en.password)).toBeInTheDocument()
            expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument()
        })

        it('Exibindo mensagem de erro para senhas diferentes em português', async () => {
            setup()
            await userEvent.click(portugueseLanguage)
            await userEvent.type(password, "Senha")
            await userEvent.type(passwordRepeat, "SenhaDiferente")
            const validation = screen.queryByText(ptBr.passwordMismatchValidation)
            expect(validation).toBeInTheDocument()
        })

        it("Enviando ao backend o accept language en nas requisições", async () => {
            setup()
            await userEvent.type(username, "user1")
            await userEvent.type(email, "user1@email.com")
            await userEvent.type(password, "S3nh4")
            await userEvent.type(passwordRepeat, "S3nh4")
            await userEvent.click(button)
            await screen.findByText("Please check your e-mail to active your account")
            expect(acceptLanguageHeader).toBe('en')
        })

        it("Enviando ao backend o accept language ptBt nas requisições após trocar o idioma", async () => {
            setup()
            await userEvent.click(portugueseLanguage)
            await userEvent.type(username, "user1")
            await userEvent.type(email, "user1@email.com")
            await userEvent.type(password, "S3nh4")
            await userEvent.type(passwordRepeat, "S3nh4")
            await userEvent.click(button)
            await screen.findByText("Please check your e-mail to active your account")
            expect(acceptLanguageHeader).toBe('pt-br')
        })
    })
})