# routes/project.py
from flask import Blueprint, request, jsonify
from backend.app.db.database import db
from backend.app.models.project import Project, ProjectMember, UserRole
from backend.app.models.users import Users
from backend.app.utils.auth import token_required
from sqlalchemy import func, case
from backend.app.models.task import Task

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/api/projects', methods=['GET'])
@token_required
def get_user_projects(current_user):
    # Query projects with task counts
    try:
        projects_with_stats = (
            db.session.query(
                Project,
                ProjectMember.role,
                func.count(Task.id).label('total_tasks'),
                func.count(
                    case(
                        (Task.completed == False, Task.id),
                        else_=None
                    )
                ).label('incomplete_tasks')
            )
            .join(ProjectMember, Project.id == ProjectMember.project_id)
            .outerjoin(Task, Project.id == Task.project_id)
            .filter(ProjectMember.user_id == current_user.id)
            .group_by(Project.id, ProjectMember.role)
            .all()
        )
    except Exception as e:
        return jsonify({'error': 'Failed to fetch projects'}), 500

    result = [{
        'id': project.id,
        'title': project.title,
        'totalTasks': total_tasks or 0,
        'incompleteTasks': incomplete_tasks or 0,
        'userRole': role.value,
        'created_at': project.created_at.isoformat()
    } for project, role, total_tasks, incomplete_tasks in projects_with_stats]

    return jsonify(result)

# routes/project.py
@projects_bp.route('/api/projects', methods=['POST'])
@token_required
def create_project(current_user):
    data = request.get_json()

    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400

    title = data['title'].strip()
    if not title:
        return jsonify({'error': 'Title cannot be empty'}), 400

    if len(title) > 100:
        return jsonify({'error': 'Title is too long'}), 400

    try:
        # Create project and add current user as owner
        project = Project(title=title)
        db.session.add(project)
        db.session.flush()  # Get project ID without committing

        # Add creator as project owner - use .value to get the string value
        member = ProjectMember(
            project_id=project.id,
            user_id=current_user.id,
            role=UserRole.OWNER.value  # Use .value here to get 'owner' string
        )
        db.session.add(member)
        db.session.commit()

        return jsonify({
            'id': project.id,
            'title': project.title,
            'totalTasks': 0,
            'incompleteTasks': 0,
            'userRole': UserRole.OWNER.value,  # Use .value here as well
            'created_at': project.created_at.isoformat()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create project'}), 500

@projects_bp.route('/api/projects/<int:project_id>/members', methods=['POST'])
@token_required
def add_project_member(current_user, project_id):
    # Check if current user is project owner
    member = ProjectMember.query.filter_by(
        project_id=project_id,
        user_id=current_user.id,
        role=UserRole.OWNER
    ).first()

    if not member:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    if not data or 'user_id' not in data:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        new_member = ProjectMember(
            project_id=project_id,
            user_id=data['user_id'],
            role=UserRole.MEMBER
        )
        db.session.add(new_member)
        db.session.commit()
        return jsonify({'message': 'Member added successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add member'}), 500

@projects_bp.route('/api/projects/<int:project_id>', methods=['GET'])
@token_required
def get_project_details(current_user, project_id):
    # Check if user is a member of the project
    member = ProjectMember.query.filter_by(
        project_id=project_id,
        user_id=current_user.id
    ).first()

    if not member:
        return jsonify({'error': 'Unauthorized'}), 403

    # Get project details with task statistics
    project_details = (
        db.session.query(
            Project,
            ProjectMember.role,
            func.count(Task.id).label('total_tasks'),
            func.count(
                case(
                    (Task.completed == False, Task.id),
                    else_=None
                )
            ).label('incomplete_tasks')
        )
        .join(ProjectMember, Project.id == ProjectMember.project_id)
        .outerjoin(Task, Project.id == Task.project_id)
        .filter(Project.id == project_id)
        .group_by(Project.id, ProjectMember.role)
        .first()
    )

    if not project_details:
        return jsonify({'error': 'Project not found'}), 404

    project, role, total_tasks, incomplete_tasks = project_details

    # Get project members
    members = (
        db.session.query(
            Users.id,
            Users.email,
            ProjectMember.role
        )
        .join(ProjectMember, Users.id == ProjectMember.user_id)
        .filter(ProjectMember.project_id == project_id)
        .all()
    )

    return jsonify({
        'id': project.id,
        'title': project.title,
        'totalTasks': total_tasks or 0,
        'incompleteTasks': incomplete_tasks or 0,
        'userRole': role.value,
        'created_at': project.created_at.isoformat(),
        'members': [{
            'id': member.id,
            'email': member.email,
            'role': member.role.value
        } for member in members]
    })
