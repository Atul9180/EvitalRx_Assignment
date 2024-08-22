import React, { useState } from "react";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !name ||
      !mobile ||
      !email ||
      !dob ||
      !gender ||
      !address ||
      !password
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Mobile number must be 10 digits.");
      return;
    }

    try {
      await signup(name, mobile, email, dob, gender, address, password);

      toast.success("Signup successful! Redirecting to email verification...");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen w-full md:w-[50vw]">
      <div className="w-full max-w-4xl md:max-w-3xl lg:max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form
          onSubmit={handleSignUp}
          className="grid gap-6 grid-cols-1 md:grid-cols-2"
        >
          {/* Form Fields */}
          <div className="col-span-1">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div className="col-span-1">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div className="col-span-1">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div className="col-span-1">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div className="col-span-1">
            <input
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="Select or enter gender"
              required
            />
          </div>
          <div className="col-span-1">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-4xl px-4 py-4 bg-gray-400 bg-opacity-50 flex justify-center mt-8 rounded-lg shadow-lg">
        <p className="text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            disabled={isLoading}
            className="text-green-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
