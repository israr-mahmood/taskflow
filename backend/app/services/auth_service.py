from backend.app.models.user import User
from backend.app.db.database import db
from werkzeug.security import generate_password_hash, check_password_hash
from backend.app.utils.jwt_handler import generate_token

class AuthService:
    @staticmethod
    def register_user(email, password):
        hashed = generate_password_hash(password)
        user = User(email=email, password_hash=hashed)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            return generate_token(user.id)
        return None
