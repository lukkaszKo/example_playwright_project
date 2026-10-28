import { faker } from '@faker-js/faker';
import { CreateTaskData } from '../models/tasks.model';

export function buildTaskData(overrides: Partial<CreateTaskData> = {}): CreateTaskData {
  return {
    title: `${faker.lorem.words(3)} ${faker.string.alphanumeric(6)}`,
    priority: 'medium',
    status: 'backlog',
    ...overrides,
  };
}
