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
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedIds((prev) => prev.filter((id) => id !== recipe._id));
      setSavedDocs((prev) => prev.filter((r) => r.recipeId !== recipe._id));
    } else {
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

  return (
    <main className="planner-week">
      <header className="planner-header">
        <h1>My Weekly Kitchen</h1>
        <p>Plan calmly. Cook with intention.</p>
      </header>

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
    </main>
  );
}
