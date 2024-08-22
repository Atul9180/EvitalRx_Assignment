import React, { useState } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Logged in successfully.");
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full font-bold bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Login"
            )}
          </button>
          <div className="text-center mt-2 font-bold">
            <Link
              to="/forgot-password"
              className="text-red-500 hover:underline"
              disabled={isLoading}
            >
              Forgot Password?
            </Link>
          </div>
          <div className="w-full max-w-4xl p-4 bg-gray-400 bg-opacity-50 flex justify-center mt-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-700">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-red-700 font-bold hover:underline"
                disabled={isLoading}
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
