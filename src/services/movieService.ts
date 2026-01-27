import type { Movie } from "../types/movie";
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = import.meta.env.VITE_API_KEY;

interface MoviesResponse {
  results: Movie[];
}

export default async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get<MoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        language: 'en-US',
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    }
  );

  return response.data.results;
}
