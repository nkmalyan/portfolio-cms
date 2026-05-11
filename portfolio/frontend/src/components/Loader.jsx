import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">MyPortfolio</Link>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/blogs">Blog</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}