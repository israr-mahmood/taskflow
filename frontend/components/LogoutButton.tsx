import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';

export function LogoutButton() {
  const logout = useAuthStore(state => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
    >
      Logout
    </button>
  );
}
