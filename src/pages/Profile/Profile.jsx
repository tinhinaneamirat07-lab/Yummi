import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const SAVE_API = "http://localhost:5000/api/saved-recipes";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [saved, setSaved] = useState([]);

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

    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    if (!token) return;

    try {
      const res = await fetch(SAVE_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSaved(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("profilePhoto", reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <main className="profile-page">
        <p className="profile-empty">
          Please login to access your personal kitchen.
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
          Change photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
          />
        </label>

        <h1>{user.name}</h1>
        <p className="profile-email">{user.email}</p>
      </section>

      {/* SAVED RECIPES */}
      <section className="profile-saved">
        <h2>Your saved rituals</h2>

        {saved.length === 0 ? (
          <p className="profile-empty">
            No saved recipes yet.
            <br />
            Start saving moments you love 🤎
          </p>
        ) : (
          <div className="saved-grid">
            {saved.map((r) => (
              <div
                key={r._id}
                className="saved-card"
                onClick={() =>
                  navigate(`/planner?recipe=${r.recipeId}`)
                }
              >
                <div
                  className="saved-img"
                  style={{
                    backgroundImage: r.image
                      ? `url(${r.image})`
                      : "none",
                  }}
                />
                <span>{r.title}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
