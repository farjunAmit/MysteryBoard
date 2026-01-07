<div className="movies_page">
  <h1 className="movies_title">Movies</h1>

  <div className="movies_grid">
    {movies.map((m) => (
      <div key={m.id} className="movie_card">
        <h2 className="movie_title">{m.title}</h2>

        <img src={m.imgurl} alt="no image" className="movie_img" />

        <div className="movie_genres">
          {m.genres.map((g, i) => (
            <span key={i} className="movie_genre">
              {g}
            </span>
          ))}
        </div>
        
        <p className="movie_description">{m.description}</p>
      </div>
    ))}
  </div>
</div>;
