import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = () => {
    API.get("/contact").then((res) => setMessages(res.data));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/contact/${id}`);
    fetchMessages();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-700">User Messages 📩</h2>
      {messages.length === 0 && <p>No messages yet.</p>}
      {messages.map((m) => (
        <div key={m._id} className="border p-4 rounded shadow">
          <p><strong>{m.name}</strong> ({m.email})</p>
          <p className="text-gray-700 mt-2">{m.message}</p>
          <button
            onClick={() => handleDelete(m._id)}
            className="bg-red-600 text-white px-3 py-1 rounded mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}