import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Task } from '@/types/task';
import { fetchTaskDetails } from '@/utils/api';
import Link from 'next/link';

export default function TaskPage() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);

  const loadTask = async () => {
    try {
      const taskData = await fetchTaskDetails(Number(id));
      setTask(taskData);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <Link
              href={`/projects/${task.project_id}`}
              className="text-teal-600 hover:text-teal-800"
            >
              ← Back to Project
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-4">{task.title}</h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 text-sm text-gray-900">{task.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
              <p className="mt-1 text-sm text-gray-900">
                {task.assignedUser?.email || 'Unassigned'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <p className="mt-1 text-sm text-gray-900">
                {task.creator?.email || 'Unknown'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(task.updated_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
