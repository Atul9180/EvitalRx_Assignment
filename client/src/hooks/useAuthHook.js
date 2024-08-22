import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { user, isAuthenticated, isCheckingAuth, checkAuth, logout } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    checkUserAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return { user, isAuthenticated, isCheckingAuth, handleLogout };
};
