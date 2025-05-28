import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

function Home() {
  const { login, logout, authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");

    if (token && userData) {
      const parsedUser = JSON.parse(decodeURIComponent(userData));

      login({
        token,
        google_id: parsedUser.google_id,
        id: parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
        phone: parsedUser.phone,
      });

      // toast.success("Logged in successfully", { autoClose: 3000 });
      navigate("/dashboard");
    }
  }, [login, navigate]);

  return (
    <div>
      {authState.user ? (
        <>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Welcome to Expense Manager</h1>
            <p>Manage your expenses efficiently.</p>
          </div>
        </>
      ) : (
        <>
         <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Welcome to Expense Manager</h1>
            <p>Manage your expenses efficiently.</p>
        <p>You are not logged in</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;

// import React from "react";

// const Home = () => {
//   return (
//     <div style={{ padding: "2rem", textAlign: "center" }}>
//       <h1>Welcome to Expense Manager</h1>
//       <p>Manage your expenses efficiently.</p>
//     </div>
//   );
// };

// export default Home;
