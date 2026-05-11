import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/contact", form);
      setStatus("✅ Message sent! Thanks for reaching out.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("❌ Unauthorized: Please login to send messages.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto text-center space-y-10 py-10">
      {/* === Hero Section === */}
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Hi, Welcome <span className="text-blue-600">{user ?.name || "USER"}</span>
        </h1>

        {/* === Logged‑in Greeting === */}
        {user && (
          <p className="mt-3 text-lg font-semibold text-emerald-600">
             Welcome back, {user.name}!
          </p>
        )}

        <p className="text-gray-700 max-w-xl mx-auto">
          Full-stack developer and tech writer.
           Here, I showcase my latest MERN projects and share my journey of turning complex logic into scalable web solutions.
        </p>

        {/* === Visit Blog Button === */}
        <div className="pt-4 flex justify-center">
          <Link
            to="/blogs"
            className="inline-block px-10 py-4 text-lg font-semibold text-white 
                       rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                       shadow-lg shadow-purple-300 
                       hover:scale-105 hover:shadow-2xl 
                       transition-all duration-300 ease-in-out"
          >
             Visit My Blog
          </Link>
        </div>
      </div>

      {/* === Contact Form Section === */}
      <div
        id="contact"
        className="bg-white p-8 shadow-lg rounded-xl mt-12 text-left border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Contact-Me
        </h2>
        <p className="text-sm text-black-500 font-bold text-center mb-6">
          Get in Touch
        </p>

        {status && (
          <p
            className={`text-center font-medium mb-4 p-2 rounded ${
              status.startsWith("✅")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {status}
          </p>
        )}

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="message"
              rows="4"
              placeholder="Write your secure message here…"
              value={form.message}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Send Secure Message
            </button>
          </form>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-600 mb-4">
               Please login  to start a conversation.
            </p>
            <Link
              to="/admin"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition"
            >
              Login to Message
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}