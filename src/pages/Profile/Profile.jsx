import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tagline, setTagline] = useState("");
  const [favoriteCuisine, setFavoriteCuisine] = useState("");
  const [kitchenCity, setKitchenCity] = useState("");
  const [statusSaved, setStatusSaved] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPhoto = localStorage.getItem("profilePhoto");
    const storedTagline = localStorage.getItem("profileTagline");
    const storedCuisine = localStorage.getItem("profileCuisine");
    const storedCity = localStorage.getItem("profileCity");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedPhoto) {
      setPhoto(storedPhoto);
    }

    if (storedTagline) {
      setTagline(storedTagline);
    }

    if (storedCuisine) {
      setFavoriteCuisine(storedCuisine);
    }

    if (storedCity) {
      setKitchenCity(storedCity);
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("profilePhoto", reader.result);
      setLoading(false);
      setError(null);
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
      <section className="profile-hero">
        <div className="profile-hero-card">
          <div className="profile-avatar">
            {photo ? (
              <img src={photo} alt="profile" />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>

          <div className="profile-identity">
            <h1>{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-tagline">
              {tagline || "Crafting cozy moments, one recipe at a time."}
            </p>

            <div className="profile-badges">
              <span>Warm Kitchen</span>
              <span>Recipe Keeper</span>
              <span>Slow Rituals</span>
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
          </div>
        </div>
      </section>

      <section className="profile-grid">
        <div className="profile-card">
          <h2>Profile Notes</h2>
          <p className="profile-sub">
            Make this space yours. Your notes are saved locally on this device.
          </p>
          <label className="profile-field">
            Tagline
            <input
              value={tagline}
              onChange={(e) => {
                setTagline(e.target.value);
                setStatusSaved(false);
              }}
              placeholder="e.g. Cozy baker with a love for spice"
            />
          </label>
          <label className="profile-field">
            Favorite cuisine
            <input
              value={favoriteCuisine}
              onChange={(e) => {
                setFavoriteCuisine(e.target.value);
                setStatusSaved(false);
              }}
              placeholder="e.g. Mediterranean, North African..."
            />
          </label>
          <label className="profile-field">
            Kitchen city
            <input
              value={kitchenCity}
              onChange={(e) => {
                setKitchenCity(e.target.value);
                setStatusSaved(false);
              }}
              placeholder="e.g. Algiers"
            />
          </label>
          <div className="profile-actions">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem("profileTagline", tagline);
                localStorage.setItem("profileCuisine", favoriteCuisine);
                localStorage.setItem("profileCity", kitchenCity);
                setStatusSaved(true);
              }}
            >
              Save changes
            </button>
            {statusSaved && <span className="profile-saved">Saved</span>}
          </div>
        </div>

        <div className="profile-card profile-card-contrast">
          <h2>Kitchen Vibe</h2>
          <p className="profile-sub">
            Curate your ritual. Tap a card to feel the mood.
          </p>
          <div className="profile-vibe-grid">
            <button type="button">Golden Mornings</button>
            <button type="button">Slow Bakes</button>
            <button type="button">Comfort Soups</button>
            <button type="button">Elegant Evenings</button>
          </div>
        </div>

        <div className="profile-card">
          <h2>Next Ritual</h2>
          <p className="profile-sub">
            A little inspiration for your next kitchen moment.
          </p>
          <div className="profile-ritual">
            <div>
              <h3>Sunday Bake</h3>
              <p>Try a spiced apple crumble with cardamom.</p>
            </div>
            <div className="profile-ritual-badge">New</div>
          </div>
        </div>
      </section>
    </main>
  );
}
