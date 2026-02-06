import React, { useEffect, useState } from "react";
import "./Recipes.css";

const API = "http://localhost:5000/api/saved-recipes"; 

export default function Recipes() {
  const [saved, setSaved] = useState([]);  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const token = localStorage.getItem("token"); 
  const recipes = [
    {
      _id: "1",
      title: "Golden Banana Bread",
      mood: "Soft & comforting",
      img: "/Pics/Banana Loaf with Walnuts.jpg",
    },
    {
      _id: "2",
      title: "Silk Tiramisu",
      mood: "Slow & indulgent",
      img: "/Pics/Tiramisú Clásico .jpg",
    },
    {
      _id: "3",
      title: "Butter Croissant",
      mood: "Warm morning ritual",
      img: "/Pics/Best Bread In France In 2025.jpg",
    },
    {
      _id: "4",
      title: "Chourba Frik",
      mood: "Deep & nostalgic",
      img: "/Pics/chourba frik  copy.jpg",
    },
    {
      _id: "5",
      title: "Mushroom Risotto",
      mood: "Earthy & calm",
      img: "/Pics/Velouté de Champignons Onctueux.jpg",
    },
    {
      _id: "6",
      title: "Apple Crumble",
      mood: "Golden & familiar",
      img: "/Mini Apple Crumbles with Cinnamon _ Elegant Fall Dessert.jpg",
    },
    {
      _id: "7",
      title: "Honey Roasted Carrots",
      mood: "Gentle & warm",
      img: "/Roasted Honey Glazed Carrots Recipe - MushroomSalus.jpg",
    },
    {
      _id: "8",
      title: "Evening Soup",
      mood: "Quiet & grounding",
      img: "/Grain-free coconut flour muffins perfect for winter mornings.jpg",
    },
    {
      _id: "9",
      title: "Dark Chocolate Cake",
      mood: "Deep indulgence",
      img: "/Pics/Blackout Cake.jpg",
    },
  ];

  
  useEffect(() => {
    if (!token) return;  

    fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map((r) => r.recipeId); 
        setSaved(ids); 
      })
      .catch(console.error);  
  }, [token]); 
  
  const total = recipes.length;
  const wrapIndex = (index) => (index + total) % total;
  const getOffset = (index) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total);
    }, 4000);
    return () => clearInterval(id);
  }, [isPaused, total]);

  
  const toggleSave = async (recipe) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    // UNSAVE the recipe
    if (saved.includes(recipe._id)) {
      
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const found = data.find((r) => r.recipeId === recipe._id);

      if (found) {
        // DELETE saved recipe from the backend
        await fetch(`${API}/${found._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      }

     
      setSaved((prev) => prev.filter((id) => id !== recipe._id));
    }
    // SAVE the recipe
    else {
      // Send POST request to save the recipe
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  
        },
        body: JSON.stringify({
          recipeId: recipe._id,
          title: recipe.title,
          image: recipe.img,
        }),
      });

     
      setSaved((prev) => [...prev, recipe._id]);
    }
  };

  return (
    <section className="recipes-habit" id="recipes">
      <div className="recipes-head">
        <span>RECIPES AS RITUALS</span>
        <h2>Choose a moment</h2>
      </div>

      <div className="habit-carousel">
        <div className="habit-viewport">
          {recipes.map((r, index) => {
            const offset = getOffset(index);
            return (
              <div
                key={r._id}
                className="habit-card"
                style={{
                  "--offset": offset,
                  "--abs": Math.abs(offset),
                }}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <img src={r.img} alt={r.title} />

                <div className="habit-overlay">
                  <div className="habit-text">
                    <h3>{r.title}</h3>
                    <p>{r.mood}</p>
                  </div>

                  <button
                    className={`habit-save ${saved.includes(r._id) ? "saved" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(r);
                    }}  
                  >
                    {saved.includes(r._id) ? "♥ Saved" : "♡ Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <button
        onClick={() => window.location.href = "/explore"}
        className="explore-btn"
      >
        Explore More Recipes
      </button>
    </section>
  );
}



