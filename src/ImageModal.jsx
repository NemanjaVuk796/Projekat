export default function ImageModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {}
        <div style={imageWrapperStyle}>
          <img
            src={item.imageUrl}
            alt={item.name}
            style={imageStyle}
          />
        </div>

        <h2 style={{ color: "black" }}>{item.name}</h2>
        <p style={{ color: "black" }}>{item.description}</p>

        <p style={{ fontSize: "12px", opacity: 0.6, color: "black" }}>
          Uploaded by: {item.uid}
        </p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}


const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "520px",
  width: "90%",
  textAlign: "center"
};

const imageWrapperStyle = {
  width: "400px",
  height: "300px",
  backgroundColor: "#eee",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto 12px",
  borderRadius: "8px",
  overflow: "hidden"
};

const imageStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain"
};
