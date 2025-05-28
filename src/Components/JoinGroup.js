import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const JoinGroup = () => {
  const { authState } = useContext(AuthContext);
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/groups/join-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Successfully joined the group!");
        setInviteCode("");
      } else {
        setMessage(data.message || "Failed to join the group.");
      }
    } catch (err) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div>
      <h2>Join Group</h2>
      <form onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Enter Invitation Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />
        <button type="submit">Join</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JoinGroup;
