import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { UserSchema } from '@/validations/user';
import { loginUser, registerUser } from '@/utils/api';
import { useAuth } from '@/store/auth';

export default function HomePage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const setToken = useAuth((state) => state.setToken);

  const handleSubmit = async (data: UserSchema) => {
    if (mode === 'login') {
      const response = await loginUser(data.email, data.password);
      if (response.token) setToken(response.token);
    } else {
      const response = await registerUser(data.email, data.password);
      if (response.id) setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex">
      {/* Left Panel */}
      <div className="w-1/2 flex items-center justify-center bg-black text-white">
        <h1 className="text-5xl font-bold">Taskflow</h1>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8 py-12">
        <div className="mb-6 flex space-x-4">
          <button
            className={`px-6 py-2 border rounded ${mode === 'login' ? 'bg-black text-white' : 'border-black text-black'}`}
            onClick={() => setMode('login')}
          >
            Log In
          </button>
          <button
            className={`px-6 py-2 border rounded ${mode === 'register' ? 'bg-black text-white' : 'border-black text-black'}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-6">{mode === 'login' ? 'Log In' : 'Register'}</h2>

        <AuthForm onSubmit={handleSubmit} title="" />
      </div>
    </div>
  );
}
