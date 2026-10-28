import { expect } from '@playwright/test';
import { test } from '../../src/api/fixtures/fixtures';
import { buildTaskData } from '../../src/api/factories/task.factory';
import { CreateTaskData, Priority, Status, Task, UpdateTaskStatus } from '../../src/api/models/tasks.model';

test.describe('Tasks API', { tag: ['@api', '@task'] }, () => {
  test.describe('createTask', () => {
    test('creates a task with all fields', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData({ description: 'Test description' });

      // Act
      const task = await tasksServiceUserOne.createTask(taskData);

      // Assert
      expect(task).toMatchObject(taskData);
      expect(task.id).toBeTruthy();
      expect(task.userId).toBeTruthy();
      expect(task.createdAt).toBeTruthy();
      expect(task.updatedAt).toBeTruthy();
      expect(typeof task.position).toBe('number');
    });

    test('creates a task without description', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData({ priority: 'low' });

      // Act
      const task = await tasksServiceUserOne.createTask(taskData);

      // Assert
      expect(task).toMatchObject(taskData);
    });

    test('rejects a task without title', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData: Partial<CreateTaskData> = {
        priority: 'medium',
        status: 'backlog',
        description: 'Test description',
      };

      // Act
      const response = await tasksServiceUserOne.createTaskRaw(taskData);

      // Assert
      expect(response.status()).toBe(400);
    });

    test('rejects a task with invalid priority', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData: Partial<CreateTaskData> = {
        ...buildTaskData(),
        priority: 'medium2' as unknown as Priority,
      };

      // Act
      const response = await tasksServiceUserOne.createTaskRaw(taskData);

      // Assert
      expect(response.status()).toBe(400);
    });

    test('rejects a task with invalid status', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData: Partial<CreateTaskData> = {
        ...buildTaskData(),
        status: 'backlog2' as unknown as Status,
      };

      // Act
      const response = await tasksServiceUserOne.createTaskRaw(taskData);

      // Assert
      expect(response.status()).toBe(400);
    });
  });

  test.describe('getTasksList', () => {
    test('returns list with the created task and consistent meta', { tag: '@integration' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData({ description: 'Test description' });
      const task = await tasksServiceUserOne.createTask(taskData);

      // Act
      const { tasks, meta } = await tasksServiceUserOne.getTasksList();

      // Assert
      expect(tasks.map((t) => t.id)).toContain(task.id);
      expect(meta.count).toBe(tasks.length);
      expect(meta.remaining).toBe(meta.maxAllowed - meta.count);
    });

    test('returns tasks with all required fields', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData();
      await tasksServiceUserOne.createTask(taskData);

      // Act
      const { tasks } = await tasksServiceUserOne.getTasksList();

      // Assert
      expect(tasks.length).toBeGreaterThan(0);
      for (const task of tasks) {
        expect(task.id).toBeTruthy();
        expect(task.userId).toBeTruthy();
        expect(task.title).toBeTruthy();
        expect(task.status).toBeTruthy();
        expect(task.priority).toBeTruthy();
        expect(typeof task.position).toBe('number');
      }
    });
  });

  test.describe('getTaskInfo', () => {
    test('returns the task by id', { tag: '@integration' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData({ priority: 'high', description: 'Test description' });
      const task = await tasksServiceUserOne.createTask(taskData);

      // Act
      const info = await tasksServiceUserOne.getTaskInfo(task.id);

      // Assert
      expect(info).toEqual(task);
    });

    test('returns 404 for non-existing id', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const nonExistingId = '00000000-0000-0000-0000-000000000000';

      // Act
      const response = await tasksServiceUserOne.getTaskInfoRaw(nonExistingId);

      // Assert
      expect(response.status()).toBe(404);
    });
  });

  test.describe('updateTask', () => {
    test('updates title and priority, keeps other fields', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData({ priority: 'low', description: 'Test description' });
      const task = await tasksServiceUserOne.createTask(taskData);
      const updateData = { title: `${task.title} updated`, priority: 'high' as Priority };

      // Act
      const updated = await tasksServiceUserOne.updateTask(task.id, updateData);

      // Assert
      expect(updated).toMatchObject({
        ...updateData,
        id: task.id,
        status: task.status,
        description: task.description,
      });
    });

    test('returns 404 when updating non-existing task', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const nonExistingId = '00000000-0000-0000-0000-000000000000';
      const updateData = { priority: 'low' as const };

      // Act
      const response = await tasksServiceUserOne.updateTaskRaw(nonExistingId, updateData);

      // Assert
      expect(response.status()).toBe(404);
    });

    test('updates status and description', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData({ description: 'Test description' });
      const task = await tasksServiceUserOne.createTask(taskData);
      const updateData = { status: 'done' as Status, description: 'Updated description' };

      // Act
      const updated = await tasksServiceUserOne.updateTask(task.id, updateData);

      // Assert
      expect(updated).toMatchObject({ ...updateData, id: task.id, title: task.title, priority: task.priority });
    });

    test('rejects invalid priority', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const task = await tasksServiceUserOne.createTask(buildTaskData());
      const updateData: Partial<CreateTaskData> = { priority: 'medium2' as unknown as Priority };

      // Act
      const response = await tasksServiceUserOne.updateTaskRaw(task.id, updateData);

      // Assert
      expect(response.status()).toBe(400);
    });

    test('rejects invalid status', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const task = await tasksServiceUserOne.createTask(buildTaskData());
      const updateData: Partial<CreateTaskData> = { status: 'archived' as unknown as Status };

      // Act
      const response = await tasksServiceUserOne.updateTaskRaw(task.id, updateData);

      // Assert
      expect(response.status()).toBe(400);
    });

    test('rejects empty title', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const task = await tasksServiceUserOne.createTask(buildTaskData());
      const updateData: Partial<CreateTaskData> = { title: '' };

      // Act
      const response = await tasksServiceUserOne.updateTaskRaw(task.id, updateData);

      // Assert
      expect(response.status()).toBe(400);
    });
  });

  test.describe('updateTaskStatus', () => {
    test('updates status and position', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData();
      const task = await tasksServiceUserOne.createTask(taskData);
      const statusData = { status: 'in_progress' as Status, position: 2 };

      // Act
      const updated = await tasksServiceUserOne.updateTaskStatus(task.id, statusData);

      // Assert
      expect(updated.id).toBe(task.id);
      expect(updated.status).toBe(statusData.status);
      expect(updated.position).toBe(statusData.position);
    });

    test('updates status without position', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData();
      const task = await tasksServiceUserOne.createTask(taskData);
      const statusData = { status: 'done' as Status };

      // Act
      const updated = await tasksServiceUserOne.updateTaskStatus(task.id, statusData);

      // Assert
      expect(updated.status).toBe(statusData.status);
    });

    test('rejects invalid status', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData();
      const task = await tasksServiceUserOne.createTask(taskData);
      const statusData: Partial<UpdateTaskStatus> = { status: 'archived' as unknown as Status };

      // Act
      const response = await tasksServiceUserOne.updateTaskStatusRaw(task.id, statusData);

      // Assert
      expect(response.status()).toBe(400);
    });

    test('rejects missing status', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData();
      const task = await tasksServiceUserOne.createTask(taskData);
      const statusData: Partial<UpdateTaskStatus> = { position: 1 };

      // Act
      const response = await tasksServiceUserOne.updateTaskStatusRaw(task.id, statusData);

      // Assert
      expect(response.status()).toBe(400);
    });

    test('returns 404 when updating status of non-existing task', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const nonExistingId = '00000000-0000-0000-0000-000000000000';
      const statusData: Partial<UpdateTaskStatus> = { status: 'done' };

      // Act
      const response = await tasksServiceUserOne.updateTaskStatusRaw(nonExistingId, statusData);

      // Assert
      expect(response.status()).toBe(404);
    });
  });

  test.describe('deleteTask', () => {
    test('deletes the task', { tag: '@integration' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData();
      const task = await tasksServiceUserOne.createTask(taskData);

      // Act
      const result = await tasksServiceUserOne.deleteTask(task.id);

      // Assert
      expect(result.message).toBeTruthy();
      expect((await tasksServiceUserOne.getTaskInfoRaw(task.id)).status()).toBe(404);
    });

    test('returns 404 when deleting the same task twice', { tag: '@integration' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const taskData = buildTaskData();
      const task = await tasksServiceUserOne.createTask(taskData);
      await tasksServiceUserOne.deleteTask(task.id);

      // Act
      const response = await tasksServiceUserOne.deleteTaskRaw(task.id);

      // Assert
      expect(response.status()).toBe(404);
    });

    test('returns 404 when deleting non-existing task', { tag: '@functional' }, async ({ tasksServiceUserOne }) => {
      // Arrange
      const nonExistingId = '00000000-0000-0000-0000-000000000000';

      // Act
      const response = await tasksServiceUserOne.deleteTaskRaw(nonExistingId);

      // Assert
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Tasks access control', { tag: ['@integration', '@security'] }, () => {
    let userOneTask: Task;

    test.beforeEach(async ({ tasksServiceUserOne }) => {
      const taskData = buildTaskData({ description: 'Security test' });
      userOneTask = await tasksServiceUserOne.createTask(taskData);
    });

    test('returns 404 when another user gets the task', async ({ tasksServiceUserTwo }) => {
      // Act
      const response = await tasksServiceUserTwo.getTaskInfoRaw(userOneTask.id);

      // Assert
      expect(response.status()).toBe(404);
    });

    test('returns 404 when another user updates the task', async ({ tasksServiceUserOne, tasksServiceUserTwo }) => {
      // Act
      const response = await tasksServiceUserTwo.updateTaskRaw(userOneTask.id, { priority: 'high' });

      // Assert
      expect(response.status()).toBe(404);
      expect(await tasksServiceUserOne.getTaskInfo(userOneTask.id)).toEqual(userOneTask);
    });

    test('returns 404 when another user updates the task status', async ({ tasksServiceUserOne, tasksServiceUserTwo }) => {
      // Act
      const response = await tasksServiceUserTwo.updateTaskStatusRaw(userOneTask.id, { status: 'done' });

      // Assert
      expect(response.status()).toBe(404);
      expect(await tasksServiceUserOne.getTaskInfo(userOneTask.id)).toEqual(userOneTask);
    });

    test('returns 404 when another user deletes the task', async ({ tasksServiceUserOne, tasksServiceUserTwo }) => {
      // Act
      const response = await tasksServiceUserTwo.deleteTaskRaw(userOneTask.id);

      // Assert
      expect(response.status()).toBe(404);
      expect(await tasksServiceUserOne.getTaskInfo(userOneTask.id)).toEqual(userOneTask);
    });
  });
});
