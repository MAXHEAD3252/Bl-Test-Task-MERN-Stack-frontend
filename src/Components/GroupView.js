import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const GroupView = () => {
  const { groupId } = useParams();
  const { authState } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    splitWith: [],
  });
  const [message, setMessage] = useState("");
  const [newMembers, setNewMembers] = useState(""); // string of emails

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/groups/get-group-details/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const data = await res.json();
        setGroup(data.group);
        console.log(data.group);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch group");
      }
    };
    fetchGroup();
  }, [groupId, authState.token]);

  // Expense handlers ...

  const handleAddExpense = async (e) => {
    e.preventDefault();
    // same as before...
  };

  // New: Add members handler
  const handleAddMembers = async (e) => {
    e.preventDefault();
    if (!newMembers.trim()) {
      setMessage("Please enter at least one email");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/groups/add-members/${groupId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify({ emails: newMembers }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Members added successfully");
        setGroup(data.group); // updated group
        setNewMembers("");
      } else {
        setMessage(data.message || "Failed to add members");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };

  if (!group) return <p>Loading group...</p>;

  // Calculate total expense
  const totalExpense =
    group.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // Unique user IDs in expenses
  const uniqueUserIds = new Set();

  group.expenses?.forEach((expense) => {
    expense.splitWith?.forEach((user) => {
      uniqueUserIds.add(user._id.toString());
    });
  });

  const numberOfUsers = uniqueUserIds.size + 1; // +1 for group owner or you

  const expensePerPerson = numberOfUsers > 0 ? totalExpense / numberOfUsers : 0;
console.log(authState)
  return (
    <div style={{ padding: "2rem" }}>
      <h2>{group.name}</h2>
      <p>
        <strong>Category:</strong> {group.category}
      </p>
      <p>
        <strong>Description:</strong> {group.description}
      </p>

      <h3>Members</h3>
      <ul>
        {group.members.map((member) => (
          <li key={member._id}>
            {member.username} ({member.email})
            {member._id === group.createdBy._id && <strong> — Owner</strong>}
          </li>
        ))}
      </ul>

      <p>
        <strong>Owner:</strong> {group.createdBy?.username} (
        {group.createdBy?.email})
      </p>

      {authState.user.id === group.createdBy._id && (
        <>
          <h3>Add Members</h3>
          <form onSubmit={handleAddMembers}>
            <input
              type="text"
              placeholder="Enter member emails (comma separated)"
              value={newMembers}
              onChange={(e) => setNewMembers(e.target.value)}
            />
            <button type="submit">Add Members</button>
          </form>
        </>
      )}

      <h3>Add Expense</h3>
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={newExpense.title}
          onChange={(e) =>
            setNewExpense({ ...newExpense, title: e.target.value })
          }
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          required
        />
        <p>Select members to split with:</p>
        {group.members.map((member) => (
          <label key={member._id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={newExpense.splitWith.includes(member._id)}
              onChange={() => {
                const id = member._id;
                setNewExpense((prev) => {
                  const splitWith = prev.splitWith.includes(id)
                    ? prev.splitWith.filter((userId) => userId !== id)
                    : [...prev.splitWith, id];
                  return { ...prev, splitWith };
                });
              }}
            />
            {member.username}
          </label>
        ))}
        <button type="submit">Add Expense</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Expenses</h3>
      <p>
        <strong>Total:</strong> ₹{totalExpense.toFixed(2)}
      </p>
      <p>
        <strong>Per Person:</strong> ₹{expensePerPerson.toFixed(2)}
      </p>

      {group.expenses?.map((exp) => (
        <div
          key={exp._id}
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <p>
            <strong>Title:</strong> {exp.title}
          </p>
          <p>
            <strong>Amount:</strong> ₹{exp.amount}
          </p>
          <p>
            <strong>Split Between:</strong>{" "}
            {exp.splitWith.map((user) => user.username).join(", ")}
          </p>
          {/* Removed per person from here */}
        </div>
      ))}
    </div>
  );
};

export default GroupView;
