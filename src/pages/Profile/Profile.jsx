import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPhoto = localStorage.getItem("profilePhoto");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedPhoto) {
      setPhoto(storedPhoto);
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setLoading(true);  // Start loading state

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("profilePhoto", reader.result);  // Save photo to localStorage
      setLoading(false);  // Stop loading state
      setError(null);  // Clear any previous error
    };
    reader.onerror = () => {
      setLoading(false);
      setError("An error occurred while uploading the photo.");
    };

    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <main className="profile-page">
        <p className="profile-empty">
          Please log in to access your personal kitchen.
        </p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      {/* HERO */}
      <section className="profile-hero">
        <div className="profile-avatar">
          {photo ? (
            <img src={photo} alt="profile" />
          ) : (
            <div className="avatar-placeholder">👤</div>
          )}
        </div>

        <label className="upload-photo">
          {loading ? "Uploading..." : "Change photo"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <h1>{user.name}</h1>
        <p className="profile-email">{user.email}</p>
      </section>
    </main>
  );
}
