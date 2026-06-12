import { useState, useEffect } from "react";

const API = "/api/scheduler/to-do-list";

const defaultForm = {
  title: "",
  status: "pending",
  priority: "low",
  dueDate: "",
  isRecurring: false,
  recurrencePattern: "",
  reminderEnabled: false,
  reminderTime: "",
};

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const headers = { "Content-Type": "application/json" };

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch(API, { credentials: "include" });
      const json = await res.json();
      setTodos(json.data || []);
    } catch {
      setError("Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSorted(sortVal) {
    const res = await fetch(`${API}/sort?sortBy=${sortVal}`, {
      credentials: "include",
    });
    const json = await res.json();
    setTodos(json.data || []);
  }

  async function fetchFiltered(input) {
    const res = await fetch(`${API}/filter?input=${input}`, {
      credentials: "include",
    });
    const json = await res.json();
    setTodos(json.data || []);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await fetch(`${API}/${editId}`, {
          method: "PATCH",
          headers,
          credentials: "include",
          body: JSON.stringify(form),
        });
        setEditId(null);
      } else {
        await fetch(API, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(form),
        });
      }
      setForm(defaultForm);
      fetchAll();
    } catch {
      setError("Save failed");
    }
  }

  function handleEdit(todo) {
    setEditId(todo._id);
    setForm({
      title: todo.title || "",
      status: todo.status || "pending",
      priority: todo.priority || "low",
      dueDate: todo.dueDate?.slice(0, 10) || "",
      isRecurring: todo.isRecurring || false,
      recurrencePattern: todo.recurrencePattern || "",
      reminderEnabled: todo.reminderEnabled || false,
      reminderTime: todo.reminderTime?.slice(0, 16) || "",
    });
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" });
    fetchAll();
  }

  async function handleDeleteAll() {
    if (!confirm("Delete all?")) return;
    await fetch(API, { method: "DELETE", credentials: "include" });
    fetchAll();
  }

  function handleSort(e) {
    setSortBy(e.target.value);
    if (e.target.value) fetchSorted(e.target.value);
    else fetchAll();
  }

  function handleFilter(e) {
    setFilterInput(e.target.value);
    if (e.target.value) fetchFiltered(e.target.value);
    else fetchAll();
  }

  return (
    <div>
      <h1>To-Do List</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          required
        />
        <label>
          <input
            name="isRecurring"
            type="checkbox"
            checked={form.isRecurring}
            onChange={handleChange}
          />
          Recurring
        </label>
        {form.isRecurring && (
          <select
            name="recurrencePattern"
            value={form.recurrencePattern}
            onChange={handleChange}
          >
            <option value="">Select pattern</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        )}
        <label>
          <input
            name="reminderEnabled"
            type="checkbox"
            checked={form.reminderEnabled}
            onChange={handleChange}
          />
          Reminder
        </label>
        {form.reminderEnabled && (
          <input
            name="reminderTime"
            type="datetime-local"
            value={form.reminderTime}
            onChange={handleChange}
          />
        )}
        <button type="submit">{editId ? "Update" : "Add"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm(defaultForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p>{error}</p>}

      <div>
        <input
          placeholder="Filter..."
          value={filterInput}
          onChange={handleFilter}
        />
        <select
          value={sortBy}
          onChange={handleSort}
        >
          <option value="">Sort by...</option>
          <option value="priority">Priority</option>
          <option value="newest">Newest</option>
        </select>
        <button onClick={handleDeleteAll}>Delete All</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>
              <span>{todo.title}</span>
              <span>{todo.status}</span>
              <span>{todo.priority}</span>
              <span>{todo.dueDate?.slice(0, 10)}</span>
              {todo.isRecurring && <span>{todo.recurrencePattern}</span>}
              <button onClick={() => handleEdit(todo)}>Edit</button>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToDoList;
