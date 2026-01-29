import { useEffect, useState } from "react";
import css from "./App.module.css";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import type { MoviesResponse } from "../../services/movieService"

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
  data,
  isLoading,
  isError,
} = useQuery<MoviesResponse>({
  queryKey: ['movies', query, page],
  queryFn: () => fetchMovies(query, page),
  enabled: query !== '',
  placeholderData: (prev) => prev,
});
 
  useEffect(() => {
  if (isError) {
    toast.error("Something went wrong. Please try again.");
  }
}, [isError]);
  
  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setPage(1);
  };
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
        {totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
}
