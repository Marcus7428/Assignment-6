import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./SearchView.css";

function SearchView() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const API_KEY = import.meta.env.VITE_TMDB_KEY;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("query") || "";

        if (searchQuery) {
            fetchMovies(searchQuery, currentPage);
        }
    }, [location.search, currentPage]);

    const fetchMovies = async (searchQuery, page) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie`,
                {
                    params: {
                        api_key: API_KEY,
                        query: searchQuery,
                        page: page,
                        include_adult: false,
                    },
                }
            );
            setMovies(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="search-view-container">
            {isLoading ? (
                <p className="search-loading">Loading...</p>
            ) : movies.length > 0 ? (
                <>
                    <div className="search-results-grid">
                        {movies.map((movie) => (
                            <div
                                className="search-movie-tile"
                                key={movie.id}
                                onClick={() => navigate(`/movies/details/${movie.id}`)}
                            >
                                <img
                                    className="search-movie-poster"
                                    src={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : "https://via.placeholder.com/500x750?text=No+Image"
                                    }
                                    alt={movie.title}
                                />
                                <h3 className="search-movie-title">{movie.title}</h3>
                                <p className="search-movie-date">
                                    {movie.release_date || "Unknown Release Date"}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="search-pagination">
                        <button
                            onClick={() => handlePageChange("prev")}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange("next")}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="search-no-results">
                    No results found. Try a different search.
                </p>
            )}
        </div>
    );
}

export default SearchView;