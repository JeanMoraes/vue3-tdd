import SignUpPage from "./SignUpPage.vue";
import { render, screen } from "@testing-library/vue";
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
        it("Ativando o botão de enviar quando os campos de senha estiverem preenchidos com o mesmo valor", async () => {
            render(SignUpPage);
            const passwordInput = screen.queryByLabelText("Password");
            const passwordRepeatInput = screen.queryByLabelText("Password Repeat");

            await userEvent.type(passwordInput, 'S3nh4')
            await userEvent.type(passwordRepeatInput, 'S3nh4')

            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeEnabled()
        });

        it("Enviando username, email e senha para o backend", async () => {
            let requestBody;

            const server = setupServer(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    requestBody = req.body;
                    return res(ctx.status(200))
                })
            );
            server.listen()


            render(SignUpPage);
            const usernamedInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            const passwordInput = screen.queryByLabelText("Password");
            const passwordRepeatInput = screen.queryByLabelText("Password Repeat");

            await userEvent.type(usernamedInput, 'user1')
            await userEvent.type(emailInput, 'user1@email.com')
            await userEvent.type(passwordInput, 'S3nh4')
            await userEvent.type(passwordRepeatInput, 'S3nh4')

            const button = screen.queryByRole("button", { name: "Sign Up"});

            // const mockFn = jest.fn()
            // axios.post = mockFn

            await userEvent.click(button)
            await server.close()

            // const firstCall = mockFn.mock.calls[0]
            // const body = firstCall[1]

            expect(requestBody).toEqual({
                username: 'user1',
                email: 'user1@email.com',
                password: 'S3nh4'
            })
        })
    })
})