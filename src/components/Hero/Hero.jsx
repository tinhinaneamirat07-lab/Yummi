import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero-wrapper">
      <div className="hero-content">
        <div className="hero-text">
          <div className="the-text">
            <span className="eyebrow">Nuvia EXPERIENCE</span>
            <h1>
              Cook <span className="accent">with intent</span>
              <br />
              Eat beautifully
            </h1>
            <p className="subtitle">
              A refined way to discover recipes, plan meals, and transform everyday cooking into an experience.
            </p>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search a recipe, ingredient, or mood..."
              />
            </div>
          </div>
        </div>

        <div className="the-cards">
          <div className="hero-cards">
            <div className="card tall">
              <img src="/Pics/cake.jpg" alt="Sweet" />
              <div className="card-overlay">
                <h3>Sweet</h3>
                <p>Desserts & Comfort</p>
              </div>
            </div>

            <div className="card">
              <img src="/Pics/Savory.jpg" alt="Savory" />
              <div className="card-overlay">
                <h3>Savory</h3>
                <p>Bold & Hearty</p>
              </div>
            </div>

            <div className="baking-card">
              <div className="card wide">
                <img src="/Pics/Baking.jpg" alt="Baking" />
                <div className="card-overlay">
                  <h3>Baking</h3>
                  <p>Warm & Crafted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
