import { render, screen } from "@testing-library/vue"
import LoginPage from "./LoginPage.vue"
import userEvent from "@testing-library/user-event"

const setup = async () => {
    render(LoginPage);
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
        it('Ativar o botão de login quando o email e senha estiverem preenchidos', async () => {
            await setup();
            const emailInput = screen.queryByLabelText("E-mail");
            const passwordInput = screen.queryByLabelText("Password");

            await userEvent.type(emailInput, 'user100@mail.com')
            await userEvent.type(passwordInput, 'S3Nh4')

            const button = screen.queryByRole("button", { name: "Login"});
            expect(button).toBeEnabled()
        })
    })
})