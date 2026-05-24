import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/app/page";
import api from "../../src/service/api";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        pathname: "/",
    }),
    usePathname: () => "/",
}));

jest.mock("../../src/service/api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("Home", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test("deve renderizar a quantidade correta de posts retornados pela API", async () => {
        mockedApi.get.mockResolvedValueOnce({
            data: {
                posts: [
                    { id: 1, title: "Post 1", body: "Conteúdo 1", liked: false },
                    { id: 2, title: "Post 2", body: "Conteúdo 2", liked: false },
                    { id: 3, title: "Post 3", body: "Conteúdo 3", liked: false },
                ],
            },
        });

        render(
            <AuthProvider>
                <Home />
            </AuthProvider>
        );

        await screen.findAllByRole("listitem");
        expect(screen.getAllByRole("listitem").length).toBe(3);
    });

    test("deve exibir alerta ao clicar em Curtir sem estar autenticado", async () => {
        const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

        mockedApi.get.mockResolvedValueOnce({
            data: {
                posts: [{ id: 1, title: "Post 1", body: "Conteúdo 1", liked: false }],
            },
        });

        render(
            <AuthProvider>
                <Home />
            </AuthProvider>
        );

        await screen.findAllByRole("listitem");
        fireEvent.click(screen.getByText("Curtir"));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith(
                "Você precisa estar autenticado para curtir posts!"
            );
        });

        alertMock.mockRestore();
    });

    test("deve exibir mensagem de erro quando a API falha ao carregar posts", async () => {
        mockedApi.get.mockRejectedValueOnce(new Error("Network Error"));

        render(
            <AuthProvider>
                <Home />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(
                screen.getByText("Erro ao carregar posts. Tente novamente mais tarde.")
            ).toBeDefined();
        });
    });
});
