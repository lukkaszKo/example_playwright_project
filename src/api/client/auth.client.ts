import { APIRequestContext } from '@playwright/test';
import { LoginResponse } from '../models/auth.model';
import { getResponse, getResponseBodyJson } from '../helpers/response.helper';

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
    return await getResponse(response);
  }

  async loginRaw(email: string, password: string) {
    const response = await this.request.post('/api/auth/login', {
      data: {
        email: email,
        password: password,
      },
    });
    return response;
  }

  async getAccessToken(email: string, password: string) {
    const response = await this.loginRaw(email, password);
    const responseBody = await getResponseBodyJson<LoginResponse>(response);
    const accessToken = responseBody.access_token;
    if (!accessToken) {
      throw new Error('Failed to get access_token');
    }
    return (this.accessToken = accessToken);
  }
}
