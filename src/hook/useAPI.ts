import { apiKey } from '@/utils/connect';
import { generatePrice } from '@/utils/generator-price';
import { Movie, Genre } from '@/misc/types';

const getMovieByAPI = async (page: number = 1, query: string = ''): Promise<Movie[]> => {
    const encodedQuery = encodeURIComponent(query);
    const endpoint = query.trim()
        ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedQuery}&page=${page}`
        : `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const movies: Movie[] = await Promise.all(
            data.results.map(async (d: any): Promise<Movie> => ({
                movie_id: d.id,
                title: d.title,
                overview: d.overview,
                poster_path: d.poster_path,
                backdrop_path: d.backdrop_path,
                genre_ids: d.genre_ids,
                adult: d.adult,
                release_date: d.release_date,
                vote_average: d.vote_average,
                price: generatePrice(d.vote_average),
            }))
        );
        return movies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

const getMovieByIDAPI = async (id: string): Promise<Movie> => {
    const endpoint = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch movie by ID');
        const d = await response.json();
        const movie: Movie = {
            movie_id: d.id,
            title: d.title,
            overview: d.overview,
            poster_path: d.poster_path,
            backdrop_path: d.backdrop_path,
            genre_ids: d.genres?.map((g: any) => g.id) || [],
            adult: d.adult,
            release_date: d.release_date,
            vote_average: d.vote_average,
            price: generatePrice(d.vote_average),
        };

        return movie;
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        throw error;
    }
};

const getMovieCategory = async (): Promise<Genre[]> => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
};

export default function useMovie() {
    return {
        getMovieByAPI,
        getMovieByIDAPI,
        getMovieCategory,
    };
}
