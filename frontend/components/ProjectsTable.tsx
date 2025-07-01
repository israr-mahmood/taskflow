import { Project } from '@/types/project';
import Link from 'next/link';

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tasks
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  {project.title}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-gray-900">{project.incompleteTasks}</span>
                <span className="text-gray-500">/{project.totalTasks}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${project.userRole === 'owner' 
                    ? 'bg-teal-100 text-teal-800' 
                    : 'bg-blue-100 text-blue-800'}`}
                >
                  {project.userRole}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
