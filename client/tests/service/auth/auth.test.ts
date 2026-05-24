import { authService } from "@/service/auth/auth";
import api from "../../../src/service/api";

jest.mock("../../../src/service/api");

const mockedApi = api as jest.Mocked<typeof api>;

describe("authService", () => {
    describe("function signIn", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("deve chamar api.post com a URL e os dados corretos e retornar os dados do usuário", async () => {
            const mockResponse = { data: { id: 1, email: "aluno@teste.com" } };
            mockedApi.post.mockResolvedValueOnce(mockResponse);
            const data = { email: "aluno@teste.com", password: "abc123" };
            const user = await authService.signIn(data);
            expect(mockedApi.post).toHaveBeenCalledWith("/auth/signin", data);
            expect(user).toEqual(mockResponse.data);
        });
    });
});