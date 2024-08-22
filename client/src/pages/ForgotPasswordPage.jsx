import React, { useState } from "react";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../store/authStore";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { forgotPassword } = useAuthStore();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email address.");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email); // API call to send reset email
      toast.success(
        "Password reset email sent successfully. Please check your inbox."
      );
      navigate("/login"); // Redirect to login page or any other page after success
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Forgot Password
        </h2>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full font-bold bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Send Reset Link"
            )}
          </button>
          <div className="w-full max-w-4xl p-4 bg-gray-400 bg-opacity-50 flex justify-center mt-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-700 font-bold">
              Remembered Password?{" "}
              <Link
                to="/login"
                className="text-blue-700 font-bold hover:underline"
                disabled={isLoading}
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordPage;
