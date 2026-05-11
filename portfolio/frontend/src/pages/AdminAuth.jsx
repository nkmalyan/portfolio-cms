import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminLogin() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    profession: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // <-- Context hook

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const res = await API.post(endpoint, payload);

      // If registration was successful
      if (mode === "register") {
        alert("✅ Registration successful! Please log in now.");
        setMode("login");
        return;
      }

      // On login success -> use global login function
      login(res.data.user, res.data.token);
      navigate("/"); // redirect to home
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Server error. Check your details and try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
      {mode === "login" ? "Admin Login" : "Admin Register"} 🔐
      </h2>
      
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        {mode === "login" ? "Login" : "Register"} 🔐
      </h2>

      {error && (
        <p className="text-center mb-3 text-red-500 font-semibold">{error}</p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Register fields */}
        {mode === "register" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="age"
              placeholder="Age (15+ only)"
              min="15"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="profession"
              placeholder="Profession (e.g. Student, Developer)"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </>
        )}

        {/* Common fields */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                     text-white py-2 rounded-lg shadow hover:scale-105 transition-all duration-200"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        {mode === "login" ? "Don't have an account?" : "Already registered?"}{" "}
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-blue-600 font-semibold hover:underline"
        >
          {mode === "login" ? "Register here" : "Login"}
        </button>
      </p>
    </div>
  );
}