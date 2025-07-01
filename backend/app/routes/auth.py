from flask import Blueprint, request, jsonify
from backend.app.schemas.users import UsersCreate
from backend.app.services.auth_service import AuthService
from pydantic import ValidationError

router = Blueprint("auth", __name__)

@router.route("/register", methods=["POST"])
def register():
    try:
        data = UsersCreate(**request.json)
        user = AuthService.register_user(data.email, data.password)
        return jsonify({"id": user.id, "email": user.email})
    except ValidationError as e:
        return jsonify(e.errors()), 400

@router.route("/login", methods=["POST"])
def login():
    try:
        data = UsersCreate(**request.json)
        token = AuthService.login_user(data.email, data.password)
        if token:
            return jsonify({"token": token})
        return jsonify({"error": "Invalid credentials"}), 401
    except ValidationError as e:
        return jsonify(e.errors()), 400
