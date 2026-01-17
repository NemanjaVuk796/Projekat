import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "./firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (!user) navigate("/");
    });
    return () => unsub();
  }, [navigate]);


  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const selectedItem = useMemo(
    () => items.find(i => i.id === selectedItemId) || null,
    [items, selectedItemId]
  );

  const handleDelete = async () => {
    if (!selectedItem) return;
    if (!window.confirm("Delete this image?")) return;

    await deleteObject(ref(storage, selectedItem.storagePath));
    await deleteDoc(doc(db, "items", selectedItem.id));
    setSelectedItemId(null);
  };

  const startEdit = () => {
    setIsEditing(true);
    setEditName(selectedItem.name);
    setEditDescription(selectedItem.description);
  };

  const saveEdit = async () => {
    await updateDoc(doc(db, "items", selectedItem.id), {
      name: editName,
      description: editDescription
    });
    setIsEditing(false);
  };


  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); 
  };

  return (
    <div style={{ color: "#000", padding: "20px" }}>
      <h1>Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/form")}>Add</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)", 
          gap: "20px",
          padding: "0 30px",
          marginTop: "20px"
        }}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              textAlign: "center"
            }}
            onClick={() => {
              setSelectedItemId(item.id);
              setIsEditing(false);
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            />
            <div style={{ marginTop: "6px", fontWeight: "bold", color: "#000" }}>
              {item.name}
            </div>
          </div>
        ))}
      </div>

      {}
      {selectedItem && (
        <div style={overlay}>
          <div style={modal}>
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "contain",
                background: "#f2f2f2",
                padding: "10px",
                borderRadius: "8px"
              }}
            />

            {isEditing ? (
              <>
                <label>Name</label>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{ width: "100%" }}
                />

                <label>Description</label>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  style={{ width: "100%" }}
                />

                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{selectedItem.name}</h2>
                <p>{selectedItem.description}</p>
              </>
            )}

            {currentUser &&
              currentUser.uid === selectedItem.uid &&
              !isEditing && (
                <>
                  <button onClick={startEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </>
              )}

            <button onClick={() => setSelectedItemId(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: "20px",
  width: "500px",
  borderRadius: "10px",
  color: "#000"
};