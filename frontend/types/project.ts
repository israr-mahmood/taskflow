export interface Project {
  id: number;
  title: string;
  totalTasks: number;
  incompleteTasks: number;
  userRole: 'OWNER' | 'MEMBER';
  created_at: string;
}

export interface ProjectMember {
  id: number;
  email: string;
  role: 'OWNER' | 'MEMBER';
}

export interface ProjectDetails extends Project {
  members: ProjectMember[];
}
