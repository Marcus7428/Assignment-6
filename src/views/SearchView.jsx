import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./SearchView.css";

function SearchView() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;

    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [related, setRelated] = useState([]);
    const debounceRef = useRef();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setTotalPages(1);
            setRelated([]);
            return;
        }
        setLoading(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            axios
                .get("https://api.themoviedb.org/3/search/movie", {
                    params: {
                        api_key: import.meta.env.VITE_TMDB_KEY,
                        query,
                        page,
                    },
                })
                .then((res) => {
                    setResults(res.data.results);
                    setTotalPages(res.data.total_pages);
                    setLoading(false);
                    if (res.data.results && res.data.results.length > 0) {
                        const firstMovieId = res.data.results[0].id;
                        axios
                            .get(`https://api.themoviedb.org/3/movie/${firstMovieId}/similar`, {
                                params: {
                                    api_key: import.meta.env.VITE_TMDB_KEY,
                                },
                            })
                            .then((relRes) => setRelated(relRes.data.results || []))
                            .catch(() => setRelated([]));
                    } else {
                        setRelated([]);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setRelated([]);
                });
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [query, page]);

    const handleInputChange = (e) => {
        setSearchParams({ query: e.target.value, page: 1 });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ query, page: 1 });
    };

    return (
        <div className="search-view-container">
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for movies..."
                    value={query}
                    onChange={handleInputChange}
                />
                <button type="submit" className="search-btn">Search</button>
            </form>
            {related.length > 0 && (
                <div>
                    <h3 className="search-related-title">Related Movies</h3>
                    <div className="search-results-grid">
                        {related.slice(0, 5).map((movie) => (
                            <div key={movie.id} className="search-movie-tile">
                                <img
                                    src={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                            : "https://via.placeholder.com/300x450?text=No+Image"
                                    }
                                    alt={movie.title}
                                    className="search-movie-poster"
                                />
                                <div className="search-movie-title">{movie.title}</div>
                                <div className="search-movie-date">{movie.release_date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {loading && <div className="search-loading">Loading...</div>}
            {!loading && results.length === 0 && query && (
                <div className="search-no-results">No results found.</div>
            )}
            <div className="search-results-grid">
                {results.map((movie) => (
                    <div key={movie.id} className="search-movie-tile">
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                    : "https://via.placeholder.com/300x450?text=No+Image"
                            }
                            alt={movie.title}
                            className="search-movie-poster"
                        />
                        <div className="search-movie-title">{movie.title}</div>
                        <div className="search-movie-date">{movie.release_date}</div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="search-pagination">
                    <button
                        onClick={() => setSearchParams({ query, page: Math.max(1, page - 1) })}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setSearchParams({ query, page: Math.min(totalPages, page + 1) })}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchView;