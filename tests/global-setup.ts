import { request } from '@playwright/test';

async function globalSetup() {
  const apiRequest = await request.newContext();
  await apiRequest.post('http://localhost:8080/auth/signup', {
    data: { email: 'Teste@gmail.com', password: 'Teste123@' },
  });
  await apiRequest.dispose();
}

export default globalSetup;
