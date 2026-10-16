//Response
export interface TasksListResponse {
  tasks: Task[];
  meta: Meta;
}
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  position: number;
  createdAt: string;
  updatedAt: string;
}
interface Meta {
  count: number;
  maxAllowed: number;
  remaining: number;
}
export interface DeleteMessage {
  message: string;
}
//Request
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'backlog' | 'in_progress' | 'done';
export type CreateTaskData = {
  title: string;
  priority: Priority;
  status: Status;
  description?: string;
};
export type UpdateTaskData = Partial<CreateTaskData>;
export type UpdateTaskStatus = {
  status: Status;
  position?: number;
};
