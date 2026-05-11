import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/admin");
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs");
      const list =
        user.role === "admin"
          ? res.data
          : res.data.filter((b) => b.createdBy === user.id);
      setBlogs(list);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this blog?");
    if (!ok) return;
    try {
      await API.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading blogs...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          Dashboard{" "}
          {user.role === "admin" && (
            <span className="text-sm bg-red-500 text-white px-2 py-1 rounded ml-2">
              ADMIN
            </span>
          )}
        </h2>
        <button
          onClick={() => navigate("/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ New Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-500">
          {user.role === "admin"
            ? "No blogs yet. Create your first post!"
            : "You can manage only your blogs."}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="border rounded shadow-sm hover:shadow-lg p-3 bg-white"
            >
              {b.image && (
                <img
                  src={`http://localhost:5000${b.image}`}
                  alt={b.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h3 className="text-lg font-semibold mt-2">{b.title}</h3>
              <p className="text-sm text-gray-600">
                {b.content.slice(0, 100)}...
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Author: {b.author}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => navigate(`/create?id=${b._id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}