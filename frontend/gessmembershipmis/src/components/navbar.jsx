import { Link } from "react-router-dom";

export default function Navbar({ role }) {
  return (
    <nav className="navbar">
      <h3>{role} Panel</h3>
      <div>
        <Link to="/">Logout</Link>
      </div>
    </nav>
  );
}
