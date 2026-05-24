import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";

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

describe("Header", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("deve exibir botões 'Entrar' e 'Criar Conta' para usuário deslogado", () => {
        render(
            <AuthProvider>
                <Header />
            </AuthProvider>
        );

        expect(screen.getByText("Entrar")).toBeDefined();
        expect(screen.getByText("Criar Conta")).toBeDefined();
    });

    test("deve exibir botões 'Posts Curtidos' e 'Sair' para usuário logado", () => {
        localStorage.setItem(
            "sqa_social_user",
            JSON.stringify({ id: 1, email: "aluno@teste.com" })
        );

        render(
            <AuthProvider>
                <Header />
            </AuthProvider>
        );

        expect(screen.getByText("Posts Curtidos")).toBeDefined();
        expect(screen.getByText("Sair")).toBeDefined();
    });

    /**
     * BUG ENCONTRADO: — localStorage.ts
     *
     * saveUser() grava com a chave "user", mas getUser() lê com "sqa_social_user".
     * Após o login, ao recarregar a página o usuário não é reconhecido como
     * autenticado, e o Header exibe os botões de deslogado em vez de logado.
     *
     * Este teste vai falhar, comprovando o bug.
     */
    test("[BUG] deve exibir botões de usuário logado após salvar sessão via saveUser", async () => {
        const { saveUser } = await import("@/lib/localStorage");
        saveUser({ id: 1, email: "aluno@teste.com" });

        render(
            <AuthProvider>
                <Header />
            </AuthProvider>
        );

        // Esperado (requisito): Posts Curtidos e Sair
        // Resultado real (bug): Entrar e Criar Conta, pois saveUser e getUser usam chaves diferentes
        expect(screen.getByText("Posts Curtidos")).toBeDefined();
        expect(screen.getByText("Sair")).toBeDefined();
    });
});
