import type { Movie } from "../types/movie";
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = import.meta.env.VITE_API_KEY;

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export default async function fetchMovies(query: string, page: number): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        language: 'en-US',
        page,
      },
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    }
  );

  return response.data;
}
