export interface TasksListResponse {
  tasks: Task[];
  meta: Meta;
}

interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  count: number;
  maxAllowed: number;
  remaining: number;
}
