"use client";
import { useState } from "react";

type Card = { id: string; title: string; dueDate: string | null };
type List = { id: string; title: string; cards: Card[] };

export function BoardView({
  boardId,
  initialLists,
}: {
  boardId: string;
  initialLists: List[];
}) {
  const [lists, setLists] = useState<List[]>(initialLists);
  const [newListTitle, setNewListTitle] = useState("");

  async function addList(e: React.FormEvent) {
    e.preventDefault();
    const title = newListTitle.trim();
    if (!title) return;
    const res = await fetch(`/api/boards/${boardId}/lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const list = await res.json();
      setLists((l) => [...l, { ...list, cards: [] }]);
      setNewListTitle("");
    }
  }

  async function addCard(listId: string, title: string) {
    const res = await fetch(`/api/boards/${boardId}/lists/${listId}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const card = await res.json();
      setLists((ls) =>
        ls.map((l) => (l.id === listId ? { ...l, cards: [...l.cards, card] } : l)),
      );
    }
  }

  async function deleteCard(listId: string, cardId: string) {
    const res = await fetch(`/api/boards/${boardId}/cards/${cardId}`, { method: "DELETE" });
    if (res.ok) {
      setLists((ls) =>
        ls.map((l) => (l.id === listId ? { ...l, cards: l.cards.filter((c) => c.id !== cardId) } : l)),
      );
    }
  }

  async function deleteList(listId: string) {
    if (!confirm("Delete this list and all its cards?")) return;
    const res = await fetch(`/api/boards/${boardId}/lists/${listId}`, { method: "DELETE" });
    if (res.ok) setLists((ls) => ls.filter((l) => l.id !== listId));
  }

  return (
    <div className="board">
      {lists.map((list) => (
        <ListColumn
          key={list.id}
          list={list}
          onAddCard={(t) => addCard(list.id, t)}
          onDeleteCard={(cid) => deleteCard(list.id, cid)}
          onDeleteList={() => deleteList(list.id)}
        />
      ))}

      <form className="list" onSubmit={addList}>
        <h3>+ Add list</h3>
        <input
          className="input"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="List title"
        />
        <button className="btn" type="submit">Add</button>
      </form>
    </div>
  );
}

function ListColumn({
  list,
  onAddCard,
  onDeleteCard,
  onDeleteList,
}: {
  list: List;
  onAddCard: (title: string) => void;
  onDeleteCard: (id: string) => void;
  onDeleteList: () => void;
}) {
  const [title, setTitle] = useState("");
  return (
    <div className="list">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>{list.title}</h3>
        <button className="btn secondary" onClick={onDeleteList} style={{ padding: "4px 8px", fontSize: 12 }}>
          ×
        </button>
      </div>
      {list.cards.map((c) => (
        <div key={c.id} className="card" onDoubleClick={() => onDeleteCard(c.id)} title="Double-click to delete">
          {c.title}
          {c.dueDate && <small>{new Date(c.dueDate).toLocaleDateString()}</small>}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onAddCard(title.trim());
          setTitle("");
        }}
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
      >
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="+ Add card"
        />
      </form>
    </div>
  );
}
