import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log(authState);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navLeft}>
        <Link to="/" style={styles.brand}>ExpenseManager</Link>
      </div>
      <div style={styles.navRight}>
        {authState.user ? (
          <>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/myexpense" style={styles.link}>MyExpense</Link>
            <Link to="/join" style={styles.link}>Join Group</Link>
            <Link to="/groups" style={styles.link}>Groups</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/login" style={styles.link}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#333",
    color: "#fff",
  },
  navLeft: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  navRight: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #fff",
    borderRadius: "4px",
    color: "#fff",
    padding: "0.3rem 0.8rem",
    cursor: "pointer",
  },
  brand: {
    color: "#fff",
    textDecoration: "none",
  }
};

export default Navbar;
