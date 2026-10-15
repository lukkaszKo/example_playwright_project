import { APIRequestContext } from '@playwright/test';
import { BaseClient } from '../client/base.client';
import { AuthClient } from '../client/auth.client';
import { TasksListResponse } from '../models/tasks.model';

export class TaskService extends BaseClient {
  constructor(request: APIRequestContext, authClient: AuthClient) {
    super(request, authClient);
  }

  async getTasksList() {
    const response = await this.authGet('/api/tasks');
    if (!response.ok()) {
      throw new Error('Failed get tasks list');
    }
    const responseBody: TasksListResponse = await response.json();
    if (!responseBody) {
      throw new Error('Failed to get responseBody for TasksListResponse');
    }
    return responseBody;
  }
}
