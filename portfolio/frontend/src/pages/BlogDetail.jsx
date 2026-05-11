import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function BlogDetail() {
  const { id } = useParams(); // Blog ID
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ─── Fetch comments helper ────────────────────────────────
  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  // ─── Load blog + comments ──────────────────────────────────
  useEffect(() => {
    API.get(`/blogs/${id}`).then((res) => setBlog(res.data));
    fetchComments();
  }, [id]);

  // ─── Add new comment ───────────────────────────────────────
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await API.post(`/comments/${id}`, { message: text });
      setText("");
      fetchComments();
    } catch (err) {
      alert("Please login to comment.");
    }
  };

  // ─── Delete comment (owner/admin) ──────────────────────────
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      alert("Failed to delete comment. You may not have permission.");
    }
  };

  // ─── Delete blog (owner/admin) ─────────────────────────────
  const handleDeleteBlog = async () => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      alert("Blog deleted.");
      navigate("/blogs");
    } catch (err) {
      alert("You are not authorized to delete this blog.");
    }
  };

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  // ─── Permission logic ──────────────────────────────────────
  const canEditDeleteBlog =
    user && (user.role === "admin" || user.id === blog.createdBy);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-10">
      {/* ─── Blog Content ───────────────────────────────────── */}
      <article className="space-y-6">
        {blog.image && (
          <img
            src={`http://localhost:5000${blog.image}`}
            alt={blog.title}
            className="w-full rounded shadow"
          />
        )}

        <h1 className="text-4xl font-bold text-gray-900">{blog.title}</h1>

        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {blog.content}
        </p>

        <p className="text-sm text-gray-500 text-right italic">
          Posted by {blog.author} on{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>

        {/* 🛡️ Conditional blog owner/admin controls */}
        {canEditDeleteBlog && (
          <div className="flex gap-3 justify-end mt-3">
            <button
              onClick={() => navigate(`/create?id=${blog._id}`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              ✏️ Edit Blog
            </button>
            <button
              onClick={handleDeleteBlog}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              🗑 Delete Blog
            </button>
          </div>
        )}
      </article>

      {/* ─── Comment Section ────────────────────────────────── */}
      <section className="bg-white p-6 rounded shadow border">
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
          💬 Comments & Suggestions
        </h2>

        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              rows="3"
              placeholder="Write a suggestion or question..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-2"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="bg-gray-50 p-4 text-center border rounded text-gray-600">
            🔒 Please login to comment or give suggestions.
          </p>
        )}

        {/* Display comments */}
        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-500 text-center">
              No comments yet. Be the first!
            </p>
          )}
          {comments.map((c) => {
            const canDeleteComment =
              user && (user.role === "admin" || c.userId === user.id);
            return (
              <div
                key={c._id}
                className="border rounded p-3 bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <p className="text-gray-800">{c.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {c.userName} on{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>

                {canDeleteComment && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold ml-4"
                  >
                    ❌ Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}