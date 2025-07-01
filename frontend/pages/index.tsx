import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserSchema } from '@/validations/user';
import { loginUser, registerUser } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';


export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const setToken = useAuthStore(state => state.setToken);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema)
  });

  const onSubmit = async (data: UserSchema) => {
    try {
      if (mode === 'login') {
        const response = await loginUser(data.email, data.password);
        if (response.token) {
          setToken(response.token);
          router.push('/dashboard'); // Redirect to dashboard after login
        } else {
          setError('root', {
            message: 'Invalid credentials'
          });
        }
      } else {
        const response = await registerUser(data.email, data.password);
        if (response.id) {
          setMode('login');
          reset();
        } else {
          setError('root', {
            message: 'Registration failed'
          });
        }
      }
    } catch (error) {
      setError('root', {
        message: 'An error occurred. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center p-4">
      <div className="min-h-screen w-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
          {/* Left Side - Brand */}
          <div className="w-1/2 bg-teal-600 p-12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4 tracking-wider">
                TaskFlow
              </h1>
              <p className="text-teal-100 text-lg">
                Manage your tasks with ease
              </p>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-1/2 p-12">
            <div className="max-w-sm mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-semibold text-gray-800">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {mode === 'login'
                    ? 'Please sign in to continue'
                    : 'Get started with your account'}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition duration-200 font-medium"
                >
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
                  {errors.root && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                      {errors.root.message}
                    </div>
                  )}
              </form>

              <div className="mt-8">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setMode('login');
                      reset();
                    }}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
                      mode === 'login'
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-600 border border-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMode('register');
                      reset();
                    }}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
                      mode === 'register'
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-600 border border-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
