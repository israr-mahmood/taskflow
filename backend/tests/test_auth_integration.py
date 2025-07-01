import unittest
from backend.app.main import create_app
from backend.app.db.database import db

class AuthIntegrationTest(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.drop_all()

    def test_register_and_login(self):
        response = self.client.post("/api/auth/register", json={"email": "user@example.com", "password": "pass"})
        self.assertEqual(response.status_code, 200)

        response = self.client.post("/api/auth/login", json={"email": "user@example.com", "password": "pass"})
        self.assertIn("token", response.get_json())
