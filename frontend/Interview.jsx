import { useState, useEffect } from "react";
import { GENRES } from "./genres";
import "./Interview.css";

export default function Interview() {
  const [movies, setMovies] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("https://api.example.com/movies");
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError(error);
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  let filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchName.toLowerCase())
  );
  if (selectedGenre !== "All") {
    filteredMovies = filteredMovies.filter((m) =>
      m.genres.includes(selectedGenre)
    );
  }

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchName(value);
  }
  function handleChangeGenre(e) {
    const value = e.target.value;
    setSelectedGenre(value);
  }

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <div>
        <h1>Movies Catalog</h1>
        <input
          className="searchBox"
          type="text"
          value={searchName}
          onChange={(e) => handleSearchChange(e)}
          placeholder="enter a movie name"
        />
        <div>
          {GENRES.map((genre, i) => (
            <label key={i} className="genre-label">
              <input
                type="radio"
                name="genre"
                value={genre}
                checked={selectedGenre === genre}
                onChange={handleChangeGenre}
              />
              {genre}
            </label>
          ))}
        </div>
        <div className="movies-grid">
          {filteredMovies.map((m) => (
            <div key={m.id} className="movie-card">
              <h2>{m.title}</h2>
              <img src={m.medium}></img>
              <div className="movies-release-and-rating">
                {m.premiered}
                {m.rating.average}
              </div>
              <div className="movie-genres">
                {m.genres.map((g, i) => (
                  <span className="genre-pill" key={i}>
                    {g}{" "}
                  </span>
                ))}
              </div>
              <div>{m.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
