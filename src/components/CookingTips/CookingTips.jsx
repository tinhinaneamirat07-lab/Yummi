import { useEffect, useRef } from "react";
import "./CookingTips.css";

export default function CookingTips() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);

  const philosophies = [
    {
      number: "01",
      title: "Intent over speed",
      text: "Great food starts with patience. Slow down, taste, and adjust."
    },
    {
      number: "02",
      title: "Heat is emotion",
      text: "Fire can comfort or destroy. Learn to control it, not fear it."
    },
    {
      number: "03",
      title: "Simplicity wins",
      text: "Few ingredients, treated right, always beat complexity."
    }
  ];

  return (
    <section className="philosophy dark" ref={sectionRef}>
      <div className="philosophy-bg" />

      <div className="philosophy-inner">
        <span className="philosophy-eyebrow">The Nuvia Philosophy</span>

        <h2>
          Cooking is not a task.
          <br />
          <span>It’s a ritual.</span>
        </h2>

        <div className="philosophy-grid">
          {philosophies.map((p) => (
            <div className="philosophy-item" key={p.number}>
              <span className="philo-number">{p.number}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
