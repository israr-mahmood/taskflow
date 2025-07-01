from flask import Flask
from flask_cors import CORS
from backend.app.db.database import db
from backend.app.routes.auth import router as auth_router
from backend.app.config import Config
from backend.app.routes.project import projects_bp

def create_app():
    app = Flask(__name__)

    cors = CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],  # Add your Next.js frontend URL
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Range", "X-Content-Range"],
            "supports_credentials": True
        }
    })

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    app.config.from_object(Config)
    db.init_app(app)

    # CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    app.register_blueprint(auth_router, url_prefix="/api/auth")
    app.register_blueprint(projects_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
