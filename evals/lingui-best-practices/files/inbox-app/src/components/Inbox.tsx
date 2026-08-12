import { useState } from "react";

const FILTERS = [
  { key: "all", label: "All mail" },
  { key: "unread", label: "Unread" },
  { key: "starred", label: "Starred" },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString();
}

export function Inbox() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const unreadCount = 3;
  const lastSync = new Date();
  const user = { name: "ada" };

  return (
    <div className="inbox">
      <h1>Inbox</h1>
      <p>Welcome back, {user.name.toUpperCase()}!</p>
      <p>
        {unreadCount === 1
          ? "You have 1 unread message"
          : `You have ${unreadCount} unread messages`}
      </p>
      <input
        type="search"
        placeholder="Search messages"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <nav>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </nav>
      <footer>
        <span>Last synced at {formatTime(lastSync)}</span>
        <a href="/settings">Notification settings</a>
      </footer>
    </div>
  );
}
