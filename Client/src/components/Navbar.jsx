import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header>
      <div className="top-nav">
        <div className="container top-nav-inner">
          <NavLink to="/" className="logo-block">
            <span className="logo-main">shopshee</span>
            <span className="logo-sub">.in</span>
          </NavLink>

          <form className="search-wrap" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products, brands and categories"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          <div className="top-actions">
            {isAuthenticated ? (
              <>
                <span className="hello">Hello, {user?.name || user?.username || "User"}</span>
                <button onClick={logout} className="link-btn" type="button">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu}>Sign in</NavLink>
                <NavLink to="/register" onClick={closeMenu}>Register</NavLink>
              </>
            )}
          </div>
          <button className="menu-btn" type="button" onClick={() => setMenuOpen((prev) => !prev)}>
            Menu
          </button>
        </div>
      </div>

      <nav className="sub-nav">
        <div className={`container sub-nav-inner ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" onClick={closeMenu}>Today's Deals</NavLink>
          <NavLink to="/products?category=Electronics" onClick={closeMenu}>Electronics</NavLink>
          <NavLink to="/products?category=Wearables" onClick={closeMenu}>Mobiles</NavLink>
          <NavLink to="/products?category=Fashion" onClick={closeMenu}>Fashion</NavLink>
          <NavLink to="/products?category=Home" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products?category=Grocery" onClick={closeMenu}>Grocery</NavLink>
          {isAuthenticated && <NavLink to="/orders" onClick={closeMenu}>My Orders</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
          {!isAuthenticated && <NavLink to="/login" onClick={closeMenu}>Sign in</NavLink>}
          {!isAuthenticated && <NavLink to="/register" onClick={closeMenu}>Register</NavLink>}
        </div>
      </nav>
    </header>
  );
}
