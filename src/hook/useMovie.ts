import { getDBStore } from '@/utils/connect';
import { Movie } from '@/misc/types';

const storeName = 'tb_movie';

const getMovieBy = async (data: any = {}): Promise<{ docs: Movie[], totalDocs: number }> => {
    const store = await getDBStore(storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const movies: Movie[] = request.result.filter((movie: Movie) => {
                return Object.keys(data).every(key => movie[key as keyof Movie] === data[key]);
            });
            resolve({ docs: movies, totalDocs: movies.length });
        };

        request.onerror = (event) => {
            reject(new Error(`Error fetching movies: ${(event.target as IDBRequest).error}`));
        };
    });
};

const getMovieByID = async (data: { movie_id: string }): Promise<Movie> => {
    const store = await getDBStore(storeName);
    const request = store.get(data.movie_id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result);
            } else {
                reject(new Error('Movie not found'));
            }
        };

        request.onerror = (event) => {
            reject(new Error(`Error fetching movie by ID: ${(event.target as IDBRequest).error}`));
        };
    });
};

const insertMovie = async (data: Movie): Promise<Movie> => {
    const store = await getDBStore(storeName);
    const request = store.add(data);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(data);
        };

        request.onerror = (event) => {
            reject(new Error(`Error inserting movie: ${(event.target as IDBRequest).error}`));
        };
    });
};

const updateMovieBy = async (data: Movie): Promise<Movie> => {
    const store = await getDBStore(storeName);
    const request = store.put(data);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(data);
        };

        request.onerror = (event) => {
            reject(new Error(`Error updating movie: ${(event.target as IDBRequest).error}`));
        };
    });
};

const deleteMovieBy = async (data: { movie_id: string }): Promise<void> => {
    const store = await getDBStore(storeName);
    const request = store.delete(data.movie_id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(new Error(`Error deleting movie: ${(event.target as IDBRequest).error}`));
        };
    });
};

export default function useMovie() {
    return {
        getMovieBy,
        getMovieByID,
        insertMovie,
        updateMovieBy,
        deleteMovieBy
    };
}
