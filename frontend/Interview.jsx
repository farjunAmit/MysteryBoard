import { useState, useEffect } from "react";
import { GENRES } from "./genres";
import "./Interview.css";

export default function Interview() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching movies");
      }
    }
    fetchMovies();
  }, []);

  if (error) {
    return <div className="error_box">{error}</div>;
  }
  if (loading) {
    return <div className="loading_box">Loading...</div>;
  }
  return (
    <div className="movies_page">
      <h1 className="movies_titel">Movies</h1>
      {movies.map((m) => (
        <div key={m.id} className="movie_grid">
          <h2 className="movie_title">{m.title}</h2>
          <img src={m.imgurl} alt="no image" className="movie_img" />
          {m.genres.map((g, i) => (
            <span key={i} className="movie_genre">
              {g}
            </span>
          ))}
          <p className="movie_description">{m.description}</p>
        </div>
      ))}
    </div>
  );
}
