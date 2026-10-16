import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from '../client/base.client';
import { AuthClient } from '../client/auth.client';
import { CreateTaskData, DeleteMessage, Task, TasksListResponse, UpdateTaskData, UpdateTaskStatus } from '../models/tasks.model';

export class TaskService extends BaseClient {
  constructor(request: APIRequestContext, authClient: AuthClient) {
    super(request, authClient);
  }

  private async checkResponse<T>(response: APIResponse) {
    if (!response.ok()) {
      throw new Error(`EP: ${response.url()}, Status: ${response.status()}, Error: ${await response.text()}`);
    }
    const responseBody: T = await response.json();
    return responseBody;
  }

  async getTasksList() {
    const response = await this.authGet('/api/tasks');
    return this.checkResponse<TasksListResponse>(response);
  }

  async createTask(data: CreateTaskData) {
    const response = await this.authPost('/api/tasks', { data });
    return this.checkResponse<Task>(response);
  }

  async getTaskInfo(id: string) {
    const response = await this.authGet(`/api/tasks/${id}`);
    return this.checkResponse<Task>(response);
  }

  async updateTask(id: string, data: UpdateTaskData) {
    const response = await this.authPut(`/api/tasks/${id}`, { data });
    return this.checkResponse<Task>(response);
  }

  async deleteTask(id: string) {
    const response = await this.authDelete(`/api/tasks/${id}`);
    return this.checkResponse<DeleteMessage>(response);
  }

  async updateStatusTask(id: string, data: UpdateTaskStatus) {
    const response = await this.authPatch(`/api/tasks/${id}/status`, { data });
    return this.checkResponse<Task>(response);
  }
}
