import React, { useState, useEffect } from "react";
import "./Explore.css";

const API = "http://localhost:5000/api/saved-recipes";

export default function Explore() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch saved recipes on component mount
  useEffect(() => {
    if (!token) {
      setError("Please login to explore recipes."); 
      setLoading(false);
      return;
    }

    fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSavedRecipes(data); 
        setLoading(false); 
      })
      .catch((err) => {
        setError("Failed to load recipes. Please try again."); 
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="explore-page">
      <div className="explore-hero">
        <p className="explore-kicker">Yummi</p>
        <h1>Explore Recipes</h1>
        <p className="explore-subtitle">
          Discover and revisit your saved recipes here.
        </p>
        <div className="explore-actions">
          <div className="explore-search">
            <input
              type="text"
              placeholder="Search recipes..."
              aria-label="Search recipes"
            />
            <button className="search-btn" aria-label="Search">
              Search
            </button>
          </div>
        </div>
      </div>

      
      {loading && <p>Loading...</p>}

      
      {error && <p className="error">{error}</p>}

     
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
