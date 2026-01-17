import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "./firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!auth.currentUser) return alert("Not logged in!");
    if (!name || !description || !file) return alert("Fill all fields");

    try {
      setLoading(true);
      const user = auth.currentUser;


      const storagePath = `users/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);


      await addDoc(collection(db, "items"), {
        uid: user.uid,
        name,
        description,
        imageUrl,
        storagePath, 
        createdAt: serverTimestamp()
      });

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: "#000" }}>
      <h1>Add New Item</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleFinish} disabled={loading}>
        {loading ? "Uploading..." : "Finish"}
      </button>
    </div>
  );
}