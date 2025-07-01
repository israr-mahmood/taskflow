export interface Project {
  id: string;
  title: string;
  totalTasks: number;
  incompleteTasks: number;
  userRole: 'owner' | 'member';
}
