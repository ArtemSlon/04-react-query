import { useState } from 'react'
import css from './App.module.css'
import  fetchMovies from '../../services/movieService';
import type {Movie} from '../../types/movie';
import SearchBar from "../SearchBar/SearchBar"
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      setMovies([]);

      const data = await fetchMovies(query);

      if (data.length === 0) {
        toast.error('No movies found for your request.');
        return;
      }

      setMovies(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
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
          {isLoading && <Loader/>}
          {isError && <ErrorMessage/>}
          {movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie}/>)}
          {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />)}
        </div>
      </>
    )
  }


