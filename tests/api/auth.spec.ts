import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080';

const emailValido = 'api.teste@gmail.com';
const senhaValida = 'Teste123@';

test.describe('POST /auth/signup', () => {

  test('deve retornar 200 ao cadastrar um novo usuário', async ({ request }) => {
    const email = `novo.usuario.${Date.now()}@gmail.com`;

    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: senhaValida },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.email).toBe(email);
  });

  test('deve retornar 409 ao tentar cadastrar um e-mail já em uso', async ({ request }) => {
    const email = `duplicado.${Date.now()}@gmail.com`;

    await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: senhaValida },
    });

    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: senhaValida },
    });

    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.message).toBe('E-mail já está em uso');
  });

  test('deve retornar 422 ao enviar um e-mail inválido', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email: 'email-invalido', password: senhaValida },
    });

    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.message).toBe('E-mail inválido');
  });

  test('deve retornar 422 ao enviar uma senha inválida', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email: emailValido, password: '123' },
    });

    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.message).toBe('Senha inválida');
  });

});

test.describe('POST /auth/signin', () => {

  test.beforeAll(async ({ request }) => {
    await request.post(`${API_URL}/auth/signup`, {
      data: { email: emailValido, password: senhaValida },
    });
  });

  test('deve retornar 200 com credenciais corretas', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: emailValido, password: senhaValida },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.email).toBe(emailValido);
  });

  test('deve retornar 401 com senha incorreta', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: emailValido, password: 'SenhaErrada99!' },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Credenciais inválidas');
  });

  test('deve retornar 401 com e-mail não cadastrado', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: 'nao.existe@gmail.com', password: senhaValida },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Credenciais inválidas');
  });

});
