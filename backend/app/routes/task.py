# routes/task.py
from flask import Blueprint, jsonify, request
from backend.app.models.task import Task, TaskStatus
from backend.app.models.project import ProjectMember
from backend.app.utils.auth import token_required
from backend.app.db.database import db
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)


@tasks_bp.route('/api/projects/<int:project_id>/tasks', methods=['GET'])
@token_required
def get_project_tasks(current_user, project_id):
    # Check if user is a member of the project
    member = ProjectMember.query.filter_by(
        project_id=project_id,
        user_id=current_user.id
    ).first()

    if not member:
        return jsonify({'error': 'Unauthorized'}), 403

    tasks = (
        Task.query
        .filter_by(project_id=project_id)
        .all()
    )

    try:
        return jsonify([{
            **task.to_dict(),
            'assignedUser': {
                'id': task.assigned_user.id,
                'email': task.assigned_user.email
            } if task.assigned_user else None,
            'creator': {
                'id': task.creator_user.id,
                'email': task.creator_user.email
            } if task.creator_user else None
        } for task in tasks])
    except Exception as e:
        return jsonify({'error': 'Failed to fetch tasks'}), 500


@tasks_bp.route('/api/projects/<int:project_id>/tasks', methods=['POST'])
@token_required
def create_task(current_user, project_id):
    member = ProjectMember.query.filter_by(
        project_id=project_id,
        user_id=current_user.id
    ).first()

    if not member:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()

    task = Task(
        title=data['title'],
        description=data.get('description'),
        project_id=project_id,
        status=TaskStatus.TODO,
        created_by=current_user.id,
        assigned_to=data.get('assigned_to')
    )

    db.session.add(task)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create task'}), 500

    return jsonify(task.to_dict()), 201


@tasks_bp.route('/api/tasks/<int:task_id>', methods=['GET'])
@token_required
def get_task(current_user, task_id):
    task = Task.query.get_or_404(task_id)

    member = ProjectMember.query.filter_by(
        project_id=task.project_id,
        user_id=current_user.id
    ).first()

    if not member:
        return jsonify({'error': 'Unauthorized'}), 403

    return jsonify({
        **task.to_dict(),
        'assignedUser': {
            'id': task.assigned_user.id,
            'email': task.assigned_user.email
        } if task.assigned_user else None,
        'creator': {
            'id': task.creator_user.id,
            'email': task.creator_user.email
        } if task.creator_user else None
    })


@tasks_bp.route('/api/tasks/<int:task_id>/status', methods=['PUT'])
@token_required
def update_task_status(current_user, task_id):
    task = Task.query.get_or_404(task_id)

    member = ProjectMember.query.filter_by(
        project_id=task.project_id,
        user_id=current_user.id
    ).first()

    if not member:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    task.status = TaskStatus[data['status']]
    task.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify(task.to_dict())
