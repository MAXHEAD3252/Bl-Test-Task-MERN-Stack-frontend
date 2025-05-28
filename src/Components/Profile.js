import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";

const Profile = () => {
  const { authState, login } = useContext(AuthContext);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  if (!authState.user) {
    return <p>Please log in to see your profile.</p>;
  }
console.log(authState)
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/user/phone", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (response.ok) {
        login({
          ...authState,
          user: { ...authState.user, phone },
        });
        setMessage("Phone number updated successfully!");
      } else {
        setMessage(data.message || "Failed to update phone number");
      }
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Profile</h2>
      <p>Name: {authState.user.name}</p>
      <p>Email: {authState.user.email}</p>
      <p>Phone: {authState.user.phone || "Not added yet"}</p>

      {!authState.user.phone && (
        <form onSubmit={handlePhoneSubmit} style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit">Update Phone</button>
        </form>
      )}

      {message && <p style={{ color: "green", marginTop: "0.5rem" }}>{message}</p>}
    </div>
  );
};

export default Profile;
