import { APIRequestContext } from '@playwright/test';
import { BaseClient } from '../client/base.client';
import { AuthClient } from '../client/auth.client';
import { CreateTaskData, DeleteMessage, Task, TasksListResponse, UpdateTaskData, UpdateTaskStatus } from '../models/tasks.model';
import { getResponseBodyJson } from '../helpers/response.helper';

export class TaskService extends BaseClient {
  private readonly createdTaskIds: string[] = [];
  constructor(request: APIRequestContext, authClient: AuthClient) {
    super(request, authClient);
  }

  async getTasksListRaw() {
    const response = await this.authGet('/api/tasks');
    return response;
  }

  async getTasksList() {
    const response = await this.getTasksListRaw();
    return getResponseBodyJson<TasksListResponse>(response);
  }

  async createTaskRaw(data: Partial<CreateTaskData>) {
    const response = await this.authPost('/api/tasks', { data });
    if (response.ok()) {
      this.createdTaskIds.push((await response.json()).id);
    }
    return response;
  }

  async createTask(data: CreateTaskData) {
    const response = await this.createTaskRaw(data);
    return getResponseBodyJson<Task>(response);
  }

  async getTaskInfoRaw(id: string) {
    const response = await this.authGet(`/api/tasks/${id}`);
    return response;
  }

  async getTaskInfo(id: string) {
    const response = await this.getTaskInfoRaw(id);
    return getResponseBodyJson<Task>(response);
  }

  async updateTaskRaw(id: string, data: UpdateTaskData) {
    const response = await this.authPut(`/api/tasks/${id}`, { data });
    return response;
  }

  async updateTask(id: string, data: UpdateTaskData) {
    const response = await this.updateTaskRaw(id, data);
    return getResponseBodyJson<Task>(response);
  }

  async deleteTaskRaw(id: string) {
    const response = await this.authDelete(`/api/tasks/${id}`);
    return response;
  }

  async deleteTask(id: string) {
    const response = await this.deleteTaskRaw(id);
    return getResponseBodyJson<DeleteMessage>(response);
  }

  async updateTaskStatusRaw(id: string, data: Partial<UpdateTaskStatus>) {
    const response = await this.authPatch(`/api/tasks/${id}/status`, { data });
    return response;
  }

  async updateTaskStatus(id: string, data: UpdateTaskStatus) {
    const response = await this.updateTaskStatusRaw(id, data);
    return getResponseBodyJson<Task>(response);
  }

  async deleteCreatedTasks() {
    for (const id of this.createdTaskIds.splice(0)) {
      await this.deleteTaskRaw(id);
    }
  }
}
