import React, { useState, useEffect } from "react";
import "./Explore.css";

const API = "http://localhost:5000/api/saved-recipes";

export default function Explore() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSavedRecipes(data);
        })
        .catch(console.error);
    }
  }, [token]);

  return (
    <div className="explore-page">
      <h1>Explore Recipes</h1>
      <div className="recipe-list">
        {savedRecipes.length > 0 ? (
          savedRecipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              <p>{recipe.mood}</p>
            </div>
          ))
        ) : (
          <p>No recipes available to explore.</p>
        )}
      </div>
    </div>
  );
}
