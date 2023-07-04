import SignUpPage from "./SignUpPage.vue";
import { render, screen } from "@testing-library/vue";

it("teste ajh", () => {
    render(SignUpPage);
    const header = screen.queryByRole("heading", { name: "Sign Up"});
    expect(header).not.toBeNull()
});