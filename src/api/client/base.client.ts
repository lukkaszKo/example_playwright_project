import { APIRequestContext, APIResponse } from '@playwright/test';
import { AuthClient } from './auth.client';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class BaseClient {
  protected request: APIRequestContext;
  protected authClient: AuthClient;

  constructor(requestContext: APIRequestContext, authClient: AuthClient) {
    this.request = requestContext;
    this.authClient = authClient;
  }

  protected async authRequest(method: HttpMethod, endpoint: string, options?: Parameters<APIRequestContext[HttpMethod]>[1]): Promise<APIResponse> {
    return this.request[method](endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this.authClient.accessToken}`,
      },
    });
  }

  async authGet(endpoint: string, options?: Parameters<APIRequestContext['get']>[1]): Promise<APIResponse> {
    return this.authRequest('get', endpoint, options);
  }

  async authPost(endpoint: string, options?: Parameters<APIRequestContext['post']>[1]): Promise<APIResponse> {
    return this.authRequest('post', endpoint, options);
  }

  async authPut(endpoint: string, options?: Parameters<APIRequestContext['put']>[1]): Promise<APIResponse> {
    return this.authRequest('put', endpoint, options);
  }

  async authPatch(endpoint: string, options?: Parameters<APIRequestContext['patch']>[1]): Promise<APIResponse> {
    return this.authRequest('patch', endpoint, options);
  }

  async authDelete(endpoint: string, options?: Parameters<APIRequestContext['delete']>[1]): Promise<APIResponse> {
    return this.authRequest('delete', endpoint, options);
  }
}
