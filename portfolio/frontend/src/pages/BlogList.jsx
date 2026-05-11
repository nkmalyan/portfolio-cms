import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error loading blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  // delete blog (owner/admin only)
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this blog?");
    if (!confirm) return;
    try {
      await API.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete blog.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 font-semibold text-gray-800">
        Blog Posts
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((b) => (
          <div
            key={b._id}
            className="border rounded shadow hover:shadow-xl transition p-3 bg-white"
          >
            {b.image && (
              <img
                src={`http://localhost:5000${b.image}`}
                alt={b.title}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h3 className="text-xl font-semibold mt-2 text-gray-900">
              {b.title}
            </h3>

            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
              {b.content.slice(0, 100)}...
            </p>

            <Link
              to={`/blog/${b._id}`}
              className="text-blue-600 mt-2 inline-block hover:underline"
            >
              Read More →
            </Link>

            {/* === Conditional Edit/Delete for owner or admin === */}
            {user && (user.role === "admin" || user.id === b.createdBy) && (
              <div className="flex gap-3 mt-2">
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
            )}
          </div>
        ))}

        {blogs.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No blogs available yet.
          </p>
        )}
      </div>
    </div>
  );
}