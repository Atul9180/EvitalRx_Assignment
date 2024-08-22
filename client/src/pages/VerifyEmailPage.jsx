import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../store/authStore";

// Helper function to format date as yyyy-MM-dd
const formatDateForInput = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("T")[0].split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to parse yyyy-MM-dd format back to ISO string
const parseDateFromInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString();
};

const UserProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
        dob: formatDateForInput(user.dob), // Format for input field
        gender: user.gender || "",
        address: user.address || "",
      });
      setOriginalData({
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
        dob: formatDateForInput(user.dob), // Format for comparison
        gender: user.gender || "",
        address: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.info("No changes detected.");
      return;
    }

    setIsLoading(true);

    try {
      // Convert date string to ISO format for submission
      const updatedData = {
        ...formData,
        dob: parseDateFromInput(formData.dob),
      };

      await updateUser(updatedData);
      toast.success("Profile updated successfully.");
      setOriginalData(updatedData); // Update original data with the new data
    } catch (error) {
      toast.error(error.response.data.message);
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
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={!hasChanges || isLoading}
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
