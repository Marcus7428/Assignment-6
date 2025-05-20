import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./GenreView.css";

function GenreView() {
    const { genre_id } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${genre_id}&page=${page}&include_adult=false`
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, [genre_id, page]);

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage((prevPage) => prevPage - 1);
    };

    if (!movies.length) {
        return (
            <div className="genre-view-container">
                <h1 className="genre-title">Movies</h1>
                <p>No movies available for this genre.</p>
            </div>
        );
    }

    return (
        <div className="genre-view-container">
            <h1 className="genre-title">Movies</h1>
            <div className="movies-grid">
                {movies.map((movie) => (
                    <Link to={`/movies/details/${movie.id}`} key={movie.id} className="movie-card-link">
                        <div className="movie-card">
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="movie-poster"/>
                            <h3 className="movie-title">{movie.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page}</span>
                <button onClick={handleNextPage}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default GenreView;