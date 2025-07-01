import { useRouter } from 'next/router';
import { registerUser } from '../utils/api';
import AuthForm from '../components/AuthForm';
import type { UserSchema } from '../validations/user';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: UserSchema): Promise<void> => {
    const response = await registerUser(data.email, data.password);
    if (response.id) router.push('/login');
  };

  return <AuthForm onSubmit={handleRegister} title="Register" />;
}
