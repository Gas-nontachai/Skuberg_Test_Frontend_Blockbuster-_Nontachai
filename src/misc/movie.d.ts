export type Movie = {
    movie_id: string;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    genre_ids: string;
    adult: boolean;
    release_date: date | string;
    vote_average: number;
    price?: number;
};

export type MovieAPI = {
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    genre_ids: string;
    adult: boolean;
    release_date: date | string;
    vote_average: number;
    price?: number;
}; 