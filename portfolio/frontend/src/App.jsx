import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import AdminAuth from "./pages/AdminAuth";
import UserAuth from "./pages/UserAuth";
import AdminDashboard from "./pages/AdminDashboard";
import CreateBlog from "./pages/CreateBlog";
import Messages from "./pages/Messages";


export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/user-login" element={<UserAuth />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/admin" element={<AdminAuth />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}