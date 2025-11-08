import { useEffect, useState } from "react";
import API from "./api";
import axios from "axios";
import "./App.css";

export default function App() {
  const [refresh, setRefresh] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);

  // Fetch users
  useEffect(() => {
    async function GetData() {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    GetData();
  }, [refresh]);

  // Delete user
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(users.filter((u) => u.id !== id));
        console.log("deleted");
      })
      .catch((err) => console.error("Delete error:", err));
  };

  // Add or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // UPDATE
        const res = await API.put(`/users/${editId}`, form);
        setUsers(users.map((u) => (u.id === editId ? { ...u, ...form } : u)));
        setEditId(null);
        setForm({ name: "", email: "" });
        console.log("updated successfully");
      } else {
        // CREATE
        const res = await API.post("/users", form);
        setUsers([...users, res.data]);
        setForm({ name: "", email: "" });
        console.log("User added successfully");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        User Management
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Name"
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <ul className="space-y-3">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <span className="font-medium">
              {u.name} <span className="text-gray-600">({u.email})</span>
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(u)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(u.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setRefresh(!refresh)}
        className="mt-6 w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
      >
        Refresh
      </button>
    </div>
  );
}
