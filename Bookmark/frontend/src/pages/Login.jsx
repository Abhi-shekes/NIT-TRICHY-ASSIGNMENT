import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import authStore from "../store/authStore";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setLogIn } = authStore((state) => state);

  const navigate = useNavigate();

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const resp = await axios.post(
        "http://localhost:3000/api/login",
        { username, password },
        { withCredentials: true }
      );

      if (resp.data.status === "success") {
        setConfirmation(resp.data.message);
        setTimeout(() => {
          setLogIn({
            userid: resp.data.userid,
            role: "user",
          });
          navigate("/user/dashboard");
        }, 1000);
      } else {
        setError(resp.data.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-blue-200 via-blue-400 to-blue-600">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white text-gray-900 border border-gray-300">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {confirmation && (
          <p className="text-green-500 text-center mb-4">{confirmation}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full p-4 rounded-lg border focus:outline-none focus:ring-2 bg-gray-100 border-gray-300 text-gray-900 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full p-4 rounded-lg border focus:outline-none focus:ring-2 bg-gray-100 border-gray-300 text-gray-900 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={handlePasswordVisibility}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 rounded-lg font-semibold text-lg transition ${
              isSubmitting
                ? "cursor-not-allowed opacity-50"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
