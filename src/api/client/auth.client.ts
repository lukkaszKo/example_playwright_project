import { APIRequestContext } from '@playwright/test';
import { LoginResponse } from '../models/auth.model';

export class AuthClient {
  private request: APIRequestContext;
  public accessToken: string | null = null;

  constructor(requestContext: APIRequestContext) {
    this.request = requestContext;
  }

  async registerUser(email: string, password: string, name: string) {
    const response = await this.request.post('/api/auth/register', {
      data: {
        email: email,
        password: password,
        name: name,
      },
    });
    const statusCode = response.status();
    if (statusCode === 400) {
      throw new Error('Validation error');
    }
    if (statusCode === 409) {
      throw new Error('User already exists');
    }
    if (!response.ok()) {
      throw new Error(`Unexpected response status: ${statusCode}`);
    }
    return response;
  }

  async getAccessToken(email: string, password: string) {
    const response = await this.request.post('/api/auth/login', {
      data: {
        email: email,
        password: password,
      },
    });
    const statusCode = response.status();
    if (statusCode === 400) {
      throw new Error('Invalid email or password format');
    }
    if (statusCode === 401) {
      throw new Error('Invalid credentials');
    }
    if (!response.ok()) {
      throw new Error(`Unexpected response status: ${statusCode}`);
    }
    const responseBody: LoginResponse = await response.json();
    const accessToken = responseBody.access_token;
    if (!accessToken) {
      throw new Error('Failed to get access_token');
    }
    return (this.accessToken = accessToken);
  }
}
