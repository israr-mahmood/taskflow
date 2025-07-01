import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchProjectDetails } from '@/utils/api';
import { ProjectDetails } from '@/types/project';
import Link from 'next/link';

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProjectDetails();
    }
  }, [id]);

  const loadProjectDetails = async () => {
    try {
      const details = await fetchProjectDetails(Number(id));
      setProject(details);
      setError(null);
    } catch (err) {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Project not found'}</p>
            <Link
              href="/dashboard"
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-gray-500 mt-1">
                Created on {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tasks</h3>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-teal-600">
                {project.totalTasks}
              </span>
              <span className="text-gray-500">Total</span>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Tasks</h3>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-orange-600">
                {project.incompleteTasks}
              </span>
              <span className="text-gray-500">Incomplete</span>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Role</h3>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-blue-600">
                {project.userRole}
              </span>
              <span className="text-gray-500">Access Level</span>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {project.members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.role === 'OWNER'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
