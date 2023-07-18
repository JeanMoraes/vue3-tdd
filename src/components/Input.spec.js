import Input from './Input.vue'
import { render } from '@testing-library/vue'

it('ter a classe is-invalid quando o help existir', () => {
    const { container } = render(Input, { props: { help: 'Mensagem de erro' }})
    const input = container.querySelector("input")
    expect(input.classList).toContain("is-invalid")
})

it('ter a classe invalid-feedback no span quando o help existir', () => {
    const { container } = render(Input, { props: { help: 'Mensagem de erro' }})
    const span = container.querySelector("span")
    expect(span.classList).toContain("invalid-feedback")
})

it('não ter a classe is-invalid quando o help não existir', () => {
    const { container } = render(Input)
    const input = container.querySelector("input")
    expect(input.classList).not.toContain("is-invalid")
})