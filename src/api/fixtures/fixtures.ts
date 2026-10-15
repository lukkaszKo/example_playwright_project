import { test as base } from '@playwright/test';
import { AuthClient } from '../client/auth.client';
import { env } from '../../config/env';
import { TaskService } from '../services/tasks.service';

type ApiTestFixtures = {
  authClientUserOne: AuthClient;
  tasksServiceUserOne: TaskService;
};

export const test = base.extend<ApiTestFixtures>({
  authClientUserOne: async ({ request }, use) => {
    const user = new AuthClient(request);
    await user.getAccessToken(env.userOne.email, env.userOne.password);
    await use(user);
  },

  tasksServiceUserOne: async ({ request, authClientUserOne }, use) => {
    const tasksService = new TaskService(request, authClientUserOne);
    await use(tasksService);
  },
});
