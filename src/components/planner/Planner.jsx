import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Planner.css";

const API = "http://localhost:5000/api/recipes";
const SAVE_API = "http://localhost:5000/api/saved-recipes";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Planner() {
  const [searchParams] = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [activeRecipe, setActiveRecipe] = useState(null);

  const [savedIds, setSavedIds] = useState([]);
  const [savedDocs, setSavedDocs] = useState([]); // ⬅️ important

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    ingredients: "",
    instructions: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRecipes();
    fetchSaved();
  }, []);

  /* ================= FETCH ================= */

  const fetchRecipes = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setRecipes(data);

    // 🔥 open recipe from profile
    const recipeId = searchParams.get("recipe");
    if (recipeId) {
      const found = data.find((r) => r._id === recipeId);
      if (found) setActiveRecipe(found);
    }
  };

  const fetchSaved = async () => {
    if (!token) return;

    const res = await fetch(SAVE_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    setSavedDocs(data);
    setSavedIds(data.map((r) => r.recipeId));
  };

  /* ================= ADD ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      ...form,
      category: selectedDay,
      ingredients: form.ingredients.split(",").map((i) => i.trim()),
    };

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    });

    fetchRecipes();
    setForm({
      title: "",
      description: "",
      image: "",
      ingredients: "",
      instructions: "",
    });
  };

  /* ================= SAVE / UNSAVE ================= */

  const handleSave = async (recipe) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    // UNSAVE
    if (savedIds.includes(recipe._id)) {
      const found = savedDocs.find((r) => r.recipeId === recipe._id);
      if (!found) return;

      await fetch(`${SAVE_API}/${found._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedIds((prev) => prev.filter((id) => id !== recipe._id));
      setSavedDocs((prev) => prev.filter((r) => r.recipeId !== recipe._id));
    }
    // SAVE
    else {
      const res = await fetch(SAVE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipeId: recipe._id,
          title: recipe.title,
          image: recipe.image,
        }),
      });

      const saved = await res.json();

      setSavedIds((prev) => [...prev, recipe._id]);
      setSavedDocs((prev) => [...prev, saved]);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this recipe?");
    if (!ok) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });

    setActiveRecipe(null);
    fetchRecipes();
  };

  /* ================= EDIT ================= */

  const startEdit = () => {
    setIsEditing(true);
    setForm({
      title: activeRecipe.title,
      description: activeRecipe.description,
      image: activeRecipe.image,
      ingredients: activeRecipe.ingredients.join(", "),
      instructions: activeRecipe.instructions,
    });
  };

  const saveEdit = async () => {
    const updated = {
      ...form,
      ingredients: form.ingredients.split(",").map((i) => i.trim()),
    };

    await fetch(`${API}/${activeRecipe._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    setIsEditing(false);
    setActiveRecipe(null);
    fetchRecipes();
  };

  /* ================= RENDER ================= */

  return (
    <main className="planner-week">
      {/* HEADER */}
      <header className="planner-header">
        <h1>My Weekly Kitchen</h1>
        <p>Plan calmly. Cook with intention.</p>
      </header>

      {/* WEEK BOARD */}
      <section className="week-board">
        {DAYS.map((day) => (
          <div key={day} className="day-column">
            <h3>{day}</h3>

            {recipes
              .filter((r) => r.category === day)
              .map((r) => (
                <div
                  key={r._id}
                  className="mini-card"
                  onClick={() => {
                    setActiveRecipe(r);
                    setIsEditing(false);
                  }}
                >
                  <img src={r.image} alt={r.title} />
                  <span>{r.title}</span>
                </div>
              ))}

            <button
              className="add-to-day"
              onClick={() => setSelectedDay(day)}
            >
              + Add
            </button>
          </div>
        ))}
      </section>

      {/* ADD PANEL */}
      <section className="add-panel">
        <h2>
          Add recipe for <span>{selectedDay}</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <textarea
            placeholder="Ingredients (comma separated)"
            value={form.ingredients}
            onChange={(e) =>
              setForm({ ...form, ingredients: e.target.value })
            }
          />
          <textarea
            placeholder="Instructions"
            value={form.instructions}
            onChange={(e) =>
              setForm({ ...form, instructions: e.target.value })
            }
          />

          <button type="submit">Add to {selectedDay}</button>
        </form>
      </section>

      {/* DETAILS MODAL */}
      {activeRecipe && (
        <div className="planner-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => {
                setActiveRecipe(null);
                setIsEditing(false);
              }}
            >
              ✕
            </button>

            {isEditing ? (
              <>
                <h2>Edit Recipe</h2>

                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
                <input
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                />
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <textarea
                  value={form.ingredients}
                  onChange={(e) =>
                    setForm({ ...form, ingredients: e.target.value })
                  }
                />
                <textarea
                  value={form.instructions}
                  onChange={(e) =>
                    setForm({ ...form, instructions: e.target.value })
                  }
                />

                <div className="modal-actions">
                  <button className="save-edit" onClick={saveEdit}>
                    Save changes
                  </button>
                  <button
                    className="cancel-edit"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <img src={activeRecipe.image} alt={activeRecipe.title} />

                <h2>{activeRecipe.title}</h2>
                <p>{activeRecipe.description}</p>

                <h4>Ingredients</h4>
                <ul>
                  {activeRecipe.ingredients?.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>

                <h4>Instructions</h4>
                <p>{activeRecipe.instructions}</p>

                <div className="modal-actions">
                  <button
                    className={`heart-btn ${
                      savedIds.includes(activeRecipe._id) ? "saved" : ""
                    }`}
                    onClick={() => handleSave(activeRecipe)}
                  >
                    {savedIds.includes(activeRecipe._id)
                      ? "♥ Saved"
                      : "♡ Save"}
                  </button>

                  <button className="edit-btn" onClick={startEdit}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(activeRecipe._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
