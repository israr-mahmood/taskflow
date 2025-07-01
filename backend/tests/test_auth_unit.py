import unittest
from backend.app.services.auth_service import AuthService

class AuthUnitTest(unittest.TestCase):
    def test_register_and_login(self):
        user = AuthService.register_user("test@example.com", "secret")
        token = AuthService.login_user("test@example.com", "secret")
        self.assertIsNotNone(token)
