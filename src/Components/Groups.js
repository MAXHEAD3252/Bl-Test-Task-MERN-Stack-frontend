import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const { authState } = useContext(AuthContext);
  const [groupData, setGroupData] = useState({
    name: "",
    category: "",
    description: "",
    members: [""],
  });
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [invalidEmails, setInvalidEmails] = useState([]);

  useEffect(() => {
    if (!authState.token) return; // Don't call fetch if no token

    fetch("http://localhost:8080/api/groups/get", {
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setGroups(data.groups))
      .catch((err) => {
        console.error(err);
        setMessage("You must be logged in to view your groups.");
      });
  }, [authState.token]);

  const handleChange = (e, index) => {
    const updatedMembers = [...groupData.members];
    updatedMembers[index] = e.target.value;
    setGroupData({ ...groupData, members: updatedMembers });
  };

  const addMemberField = () => {
    if (groupData.members.length < 15) {
      setGroupData({ ...groupData, members: [...groupData.members, ""] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setInvalidEmails([]);

    try {
      const res = await fetch("http://localhost:8080/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(groupData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Group created and invitations sent!");
        setGroupData({
          name: "",
          category: "",
          description: "",
          members: [""],
        });
        setGroups((prev) => [...prev, data.group]);
      } else {
        setMessage(data.message || "Error creating group");
        if (data.invalidEmails) {
          setInvalidEmails(data.invalidEmails);
        }
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/groups/delete_group/${groupId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setGroups((prevGroups) => prevGroups.filter((g) => g._id !== groupId));
      } else {
        setMessage(data.message || "Failed to delete group");
      }
    } catch (error) {
      setMessage("Error deleting group");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create a Group</h2>
      <div
        style={{
          border: "1px solid #ccc",
          marginBottom: "1rem",
          padding: "1rem",
        }}
      >
        <form onSubmit={handleSubmit} 
        style={{display:'flex',justifyContent:'space-around',alignItems:'center', flexDirection:'column'}}>
        <div style={{width:'150vh', display:'flex',justifyContent:'space-around',alignItems:'center'}}>
          <input
            type="text"
            placeholder="Group Name"
            value={groupData.name}
            onChange={(e) =>
              setGroupData({ ...groupData, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={groupData.category}
            onChange={(e) =>
              setGroupData({ ...groupData, category: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={groupData.description}
            onChange={(e) =>
              setGroupData({ ...groupData, description: e.target.value })
            }
            required
          />
          </div>
          <div style={{width:'150vh', display:'flex',justifyContent:'space-around',alignItems:'center'}}>
          <h4>Members (Emails)</h4>

          {groupData.members.map((email, i) => (
            <input
              key={i}
              type="email"
              placeholder={`Email ${i + 1}`}
              value={email}
              onChange={(e) => handleChange(e, i)}
              required
            />
          ))}
          {groupData.members.length < 15 && (
            <button type="button" onClick={addMemberField}>
              Add Member
            </button>
          )}
          </div>
          <button type="submit">Create Group</button>
        </form>

        {message && <p>{message}</p>}
        {invalidEmails.length > 0 && (
          <div>
            <p>Invalid Emails:</p>
            <ul>
              {invalidEmails.map((email, i) => (
                <li key={i}>{email}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <hr />
      <h2>My Groups</h2>
      {groups.length === 0 && <p>No groups found.</p>}
      {groups.map((group) => (
        <div
          onClick={() => navigate(`/group/${group._id}`)}
          key={group._id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "1rem",
            padding: "1rem",
          }}
        >
          <h3>{group.name}</h3>
          <p>{group.description}</p>
          {/* Delete button visible only if user is creator */}
          {group.createdBy?._id === authState.user?.id && (
            <button
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "0.5rem",
                cursor: "pointer",
              }}
              onClick={() => handleDelete(group._id)}
            >
              Delete Group
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Groups;
