export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  WILL_NOT_DO = 'WILL_NOT_DO',
  COMPLETE = 'COMPLETE'
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  project_id: number;
  assigned_to: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  assignedUser?: {
    id: number;
    email: string;
  };
  creator?: {
    id: number;
    email: string;
  };
}
