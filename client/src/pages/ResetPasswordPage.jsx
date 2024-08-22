import React, { useState } from "react";
import { Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../store/authStore";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuthStore();

  const { token } = useParams(); // Assuming the token is passed in the URL

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, newPassword); // API call to reset password
      toast.success("Password reset successfully. You can now log in.");
      navigate("/login"); // Redirect to login page after success
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Reset Password
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="Confirm your new password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <div className="w-full max-w-4xl p-4 bg-gray-400 bg-opacity-50 flex justify-center mt-4 rounded-lg shadow-lg">
          <p className="text-sm text-gray-700">
            Don't want to change Password?{" "}
            <Link
              to="/login"
              className="text-green-700 font-bold hover:underline"
              disabled={isLoading}
            >
              login
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ResetPasswordPage;
