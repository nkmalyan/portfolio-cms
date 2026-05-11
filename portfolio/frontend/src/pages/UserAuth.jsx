import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function UserAuth() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    profession: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint =
        mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const res = await API.post(endpoint, payload);

      if (mode === "register") {
        alert("✅ Registered successfully! Please login now.");
        setMode("login");
        return;
      }

      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong, please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
        {mode === "login" ? "User Login" : "User Register"}
      </h2>
      {error && (
        <p className="text-center mb-3 text-red-500 font-semibold">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="age"
              placeholder="Age (15+)"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="profession"
              placeholder="Profession"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </>
        )}

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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        {mode === "login" ? "Don't have an account?" : "Already registered?"}{" "}
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-green-600 font-semibold hover:underline"
        >
          {mode === "login" ? "Register here" : "Login"}
        </button>
      </p>
    </div>
  );
}