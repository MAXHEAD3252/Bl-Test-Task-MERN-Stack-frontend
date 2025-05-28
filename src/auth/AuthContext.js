// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
  });

  // Load auth data from localStorage on initial load
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData && storedUserData.token) {
      setAuthState({
        token: storedUserData.token,
        user: {
          id: storedUserData.id,
          google_id: storedUserData.google_id || null,
          name: storedUserData.name,
          email: storedUserData.email,
        },
      });
    }
  }, []);

  // Login: update state and localStorage
  const login = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setAuthState({
      token: userData.token,
      user: {
        id: userData.id,
        google_id: userData.google_id || null,
        name: userData.name,
        email: userData.email,
      },
    });
  };

  // Logout: clear state and localStorage
  const logout = () => {
    localStorage.removeItem("userData");
    setAuthState({
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };


// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authState, setAuthState] = useState({
//     token: null,
//     user: null,
//   });

//   useEffect(() => {
//     const storedUserData = JSON.parse(localStorage.getItem("userData"));
//     if (storedUserData) {
//       setAuthState({
//         token: storedUserData.token,
//         user: storedUserData.user,
//       });
//     }
//   }, []);

//   const login = (userData) => {
//     localStorage.setItem(
//       "userData",
//       JSON.stringify({ token: userData.token, user: userData.user })
//     );
//     setAuthState({
//       token: userData.token,
//       user: userData.user,
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem("userData");
//     setAuthState({
//       token: null,
//       user: null,
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ authState, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

