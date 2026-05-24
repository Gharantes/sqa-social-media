import { fireEvent, render } from "@testing-library/react";
import Button from "@/components/Button";

describe("Button", () => {
    describe("function renderButton", () => {
        test("deve gerar o snapshot e ser idêntico ao snapshot anterior", () => {
            const { asFragment } = render(
                <Button onClick={() => {}}>Click me</Button>
            );
            expect(asFragment()).toMatchSnapshot();
        });

        test("deve renderizar o botão com o texto 'Click me'", () => {
            const { getByText } = render(
                <Button onClick={() => {}}>Click me</Button>
            );
            expect(getByText("Click me")).toBeDefined();
        });

        test("deve chamar a função onClick quando o botão for clicado", () => {
            const onClick = jest.fn();
            const { getByText } = render(<Button onClick={onClick}>Click me</Button>);
            fireEvent.click(getByText("Click me"));
            expect(onClick).toHaveBeenCalled();
        });
    });
});