from flask import Flask
from flask_cors import CORS
from backend.app.db.database import db
from backend.app.routes.auth import router as auth_router
from backend.app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    app.register_blueprint(auth_router, url_prefix="/api/auth")

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
