import { useRouter } from 'next/router';
import { loginUser } from '../utils/api';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../store/auth';
import type { UserSchema } from '../validations/user';

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuth((state) => state.setToken);

  const handleLogin = async (data: UserSchema): Promise<void> => {
    const response = await loginUser(data.email, data.password);
    if (response.token) {
      setToken(response.token);
      router.push('/');
    }
  };

  return <AuthForm onSubmit={handleLogin} title="Login" />;
}
