import { useAuthStore } from '@/store/authStore';
import { Project, ProjectDetails } from '@/types/project';
import {Task, TaskStatus} from "@/types/task";

export async function registerUser(email: string, password: string) {
  const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Utility function for authenticated requests
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    throw new Error('Authentication failed');
  }

  return response;
}

export async function fetchUserData() {
  try {
    const response = await authenticatedFetch('http://127.0.0.1:5000/api/user/profile');
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

export async function fetchUserProjects(): Promise<Project[]> {
  const response = await authenticatedFetch('http://127.0.0.1:5000/api/projects');
  return response.json();
}

export async function createProject(title: string): Promise<Project> {
  const response = await authenticatedFetch('http://127.0.0.1:5000/api/projects', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  return response.json();
}

export async function fetchProjectDetails(projectId: number): Promise<ProjectDetails> {
  const response = await authenticatedFetch(`http://127.0.0.1:5000/api/projects/${projectId}`);
  return response.json();
}

export async function fetchProjectTasks(projectId: number): Promise<Task[]> {
  const response = await authenticatedFetch(`http://127.0.0.1:5000/api/projects/${projectId}/tasks`);
  return response.json();
}

export async function createTask(projectId: number, taskData: {
  title: string;
  description?: string;
  assigned_to?: number;
}): Promise<Task> {
  const response = await authenticatedFetch(`http://127.0.0.1:5000/api/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
  return response.json();
}

export async function fetchTaskDetails(taskId: number): Promise<Task> {
  const response = await authenticatedFetch(`http://127.0.0.1:5000/api/tasks/${taskId}`);
  return response.json();
}

export async function updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
  const response = await authenticatedFetch(`http://127.0.0.1:5000/api/tasks/${taskId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response.json();
}
