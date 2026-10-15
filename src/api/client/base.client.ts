import { APIRequestContext, APIResponse } from '@playwright/test';
import { AuthClient } from './auth.client';

export class BaseClient {
  protected request: APIRequestContext;
  protected authClient: AuthClient;

  constructor(requestContext: APIRequestContext, authClient: AuthClient) {
    this.request = requestContext;
    this.authClient = authClient;
  }

  async authGet(endpoint: string, options?: Parameters<APIRequestContext['get']>[1]): Promise<APIResponse> {
    return this.request.get(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this.authClient.accessToken}`,
      },
    });
  }

  async authPost(endpoint: string, options?: Parameters<APIRequestContext['post']>[1]): Promise<APIResponse> {
    return this.request.post(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this.authClient.accessToken}`,
      },
    });
  }

  async authPut(endpoint: string, options?: Parameters<APIRequestContext['put']>[1]): Promise<APIResponse> {
    return this.request.put(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this.authClient.accessToken}`,
      },
    });
  }
  async authPatch(endpoint: string, options?: Parameters<APIRequestContext['patch']>[1]): Promise<APIResponse> {
    return this.request.patch(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this.authClient.accessToken}`,
      },
    });
  }

  async authDelete(endpoint: string, options?: Parameters<APIRequestContext['delete']>[1]): Promise<APIResponse> {
    return this.request.delete(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this.authClient.accessToken}`,
      },
    });
  }
}
