import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../store/authStore";

const UserProfilePage = () => {
  const { user, updateUserProfile } = useAuthStore(); // Get user data from the store
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    // Check if the user is authenticated and their email is verified
    if (user && !user.isVerified) {
      navigate("/verify-email");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch user data and set initial form data
    if (user) {
      setFormData({
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
        dob: formatDate(user.dob) || "",
        gender: user.gender || "",
        address: user.address || "",
      });
      setOriginalData({
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
        dob: formatDate(user.dob) || "",
        gender: user.gender || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Helper function to format date for input type date
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Prepare data to update
    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key] && key !== "email") {
        updatedData[key] = formData[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes detected.");
      return;
    }

    setIsLoading(true);

    try {
      await updateUserProfile(updatedData); // API call to update user profile
      toast.success("Profile updated successfully.");
      setOriginalData({ ...formData }); // Update the original data with the new data
    } catch (error) {
      console.error({ error });
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          User Profile
        </h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => (
              <div key={key} className="col-span-1">
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {key.replace(/^\w/, (c) => c.toUpperCase())}
                </label>
                <input
                  type={key === "dob" ? "date" : "text"}
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
                  required
                  disabled={key === "email"}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserProfilePage;
