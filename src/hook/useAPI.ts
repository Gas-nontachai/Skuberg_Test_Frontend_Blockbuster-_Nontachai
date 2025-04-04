import { apiKey } from '@/utils/connect';
import { generateID } from '@/utils/generator-id';
import { generatePrice } from '@/utils/generator-price';
import { Movie, Genre } from '@/misc/types';

const getMovieByAPI = async (page: number = 1): Promise<Movie[]> => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies: Movie[] = await Promise.all(
            data.results.map(async (d: any): Promise<Movie> => ({
                movie_id: await generateID(),
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
        getMovieCategory,
    };
}
