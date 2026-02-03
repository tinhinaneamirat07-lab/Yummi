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
  const [savedDocs, setSavedDocs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    ingredients: "",
    instructions: "",
    prepTime: "",
    cookTime: "",
    totalTime: "",
  });

  const token = localStorage.getItem("token"); 

  useEffect(() => {
    fetchRecipes();
    fetchSaved();
  }, []);

 
  const fetchRecipes = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setRecipes(data);

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

  // Add new recipe
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecipe = {
      ...form,
      category: selectedDay,
      ingredients: form.ingredients.split(",").map((i) => i.trim()),
    };

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
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

  // Handle saving a recipe
  const handleSave = async (recipe) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    if (savedIds.includes(recipe._id)) {
      const found = savedDocs.find((r) => r.recipeId === recipe._id);
      if (!found) return;

      await fetch(`${SAVE_API}/${found._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // JWT token needed to authorize user
        },
      });

      setSavedIds((prev) => prev.filter((id) => id !== recipe._id));
      setSavedDocs((prev) => prev.filter((r) => r.recipeId !== recipe._id));
    } else {
      const res = await fetch(SAVE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT token needed to authorize user
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

  // Handle deleting a recipe
  const handleDelete = async (recipeId) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(`${API}/${recipeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // JWT token needed to authorize user
      },
    });

    if (res.ok) {
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      setActiveRecipe(null);
    } else {
      alert("Failed to delete the recipe");
    }
  };

  // Handle editing a recipe
  const handleEdit = (recipe) => {
    setActiveRecipe(recipe);
    setIsEditing(true);
  };

  // Close recipe view
  const handleClose = () => {
    setActiveRecipe(null);
  };

  const featuredRecipe =
    activeRecipe ||
    recipes.find((r) => r.category === selectedDay) ||
    null;

  return (
    <main className="planner-week planner-luxe">
      <header className="planner-header luxe-header">
        <p className="planner-kicker">Yummi Planner</p>
        <h1>My Weekly Kitchen</h1>
        <p className="planner-subtitle">Plan calmly. Cook with intention.</p>
      </header>

      <section className="planner-ribbon">
        {DAYS.map((day) => (
          <button
            key={day}
            className={`ribbon-pill ${selectedDay === day ? "active" : ""}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </section>

      <section className="planner-grid">
        <aside className="planner-column">
          <div className="column-title">This Week</div>
          {DAYS.map((day) => (
            <div key={day} className="day-stack">
              <div className="day-label">
                <span>{day}</span>
                <button
                  className="add-to-day"
                  onClick={() => setSelectedDay(day)}
                >
                  + Add
                </button>
              </div>
              <div className="day-cards">
                {recipes.filter((r) => r.category === day).length === 0 && (
                  <p className="day-empty">No recipe yet</p>
                )}
                {recipes
                  .filter((r) => r.category === day)
                  .map((r) => (
                    <button
                      key={r._id}
                      className={`mini-card ${activeRecipe?._id === r._id ? "selected" : ""}`}
                      onClick={() => {
                        setActiveRecipe(r);
                        setIsEditing(false);
                      }}
                    >
                      <img src={r.image} alt={r.title} />
                      <div className="mini-meta">
                        <span className="recipe-title">{r.title}</span>
                        <span className="recipe-desc">
                          {r.description || "A gentle, comforting recipe."}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </aside>

        <section className="planner-feature">
          {featuredRecipe ? (
            <>
              <div className="feature-image">
                <img src={featuredRecipe.image} alt={featuredRecipe.title} />
                <div className="feature-overlay">
                  <span className="feature-day">{selectedDay}</span>
                  <h2>{featuredRecipe.title}</h2>
                  <p>{featuredRecipe.description || "A calm recipe for a quiet day."}</p>
                </div>
              </div>
              <div className="feature-body">
                <div className="feature-stats">
                  <div>
                    <span>Prep</span>
                    <strong>{featuredRecipe.prepTime || "—"}</strong>
                  </div>
                  <div>
                    <span>Cook</span>
                    <strong>{featuredRecipe.cookTime || "—"}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>{featuredRecipe.totalTime || "—"}</strong>
                  </div>
                </div>

                <div className="feature-columns">
                  <div className="feature-card">
                    <h3>Ingredients</h3>
                    {Array.isArray(featuredRecipe.ingredients) &&
                    featuredRecipe.ingredients.length > 0 ? (
                      <ul>
                        {featuredRecipe.ingredients.map((item, idx) => (
                          <li key={`${featuredRecipe._id}-ing-${idx}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="muted">Add ingredients to complete this plan.</p>
                    )}
                  </div>
                  <div className="feature-card">
                    <h3>Steps</h3>
                    <p className="steps-text">
                      {featuredRecipe.instructions ||
                        "Add instructions to keep your cooking flow effortless."}
                    </p>
                  </div>
                </div>

                <div className="feature-actions">
                  <button onClick={() => handleSave(featuredRecipe)}>
                    {savedIds.includes(featuredRecipe._id) ? "Unsave" : "Save"}
                  </button>
                  <button onClick={() => handleEdit(featuredRecipe)}>Edit</button>
                  <button onClick={() => handleDelete(featuredRecipe._id)}>
                    Delete
                  </button>
                  <button onClick={() => handleClose()}>Close</button>
                </div>
              </div>
            </>
          ) : (
            <div className="feature-empty">
              <h2>Your planner is ready</h2>
              <p>Select a day to start designing your menu.</p>
            </div>
          )}
        </section>
      </section>

      <section className="add-panel luxe-add">
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
          <div className="time-row">
            <input
              placeholder="Prep time (e.g. 15 min)"
              value={form.prepTime}
              onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
            />
            <input
              placeholder="Cook time (e.g. 30 min)"
              value={form.cookTime}
              onChange={(e) => setForm({ ...form, cookTime: e.target.value })}
            />
            <input
              placeholder="Total time (e.g. 45 min)"
              value={form.totalTime}
              onChange={(e) => setForm({ ...form, totalTime: e.target.value })}
            />
          </div>
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
    </main>
  );
}
