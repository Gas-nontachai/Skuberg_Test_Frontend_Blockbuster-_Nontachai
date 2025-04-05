"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Chip, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Movie } from '@/misc/types';
import { useAPI } from '@/hook/hooks';

const DetailPage = () => {
    const { getMovieByIDAPI } = useAPI();
    const searchParams = useSearchParams();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [cartMessage, setCartMessage] = useState<string | null>(null);

    const movie_id = searchParams.get("movie_id");

    const fetchMovie = React.useCallback(async () => {
        try {
            const data = await getMovieByIDAPI(movie_id || "");
            setMovie(data);
        } catch (error) {
            console.error("Failed to fetch movie:", error);
        } finally {
            setLoading(false);
        }
    }, [movie_id]);

    useEffect(() => {
        if (!movie_id) return;
        fetchMovie();
    }, [movie_id]);

    const addToCart = () => {
        if (movie) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const isMovieInCart = cart.some((item: { movie_id: string }) => item.movie_id === movie.movie_id);

            if (!isMovieInCart) {
                cart.push({ movie_id: movie.movie_id, title: movie.title, price: movie.price });
                localStorage.setItem('cart', JSON.stringify(cart));
                setCartMessage(`${movie.title} has been added to your cart!`);
            } else {
                setCartMessage(`${movie.title} is already in your cart.`);
            }

            setTimeout(() => setCartMessage(null), 3000);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (!movie) return <div className="p-4 text-center">Movie not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs aria-label="breadcrumb" className="text-white mb-6" color="warning">
                    <Chip
                        onClick={() => window.location.href = "/"}
                        component="a"
                        href="#"
                        label="Home"
                        icon={<Home fontSize="small" />}
                        className="cursor-pointer"
                        color="warning"
                    />
                    <Chip
                        component="a"
                        href="#"
                        label="Cart Detail"
                        className="cursor-pointer"
                        color="warning"
                    />
                </Breadcrumbs>
                <h1 className="text-5xl font-extrabold text-yellow-500 mb-6 text-center">
                    {movie.title}
                </h1>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-6/12 max-w-lg mx-auto rounded-lg shadow-lg border-4 border-yellow-500 mb-6"
                />
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    {movie.overview}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                    <div>
                        <strong>Release Date:</strong> {movie.release_date}
                    </div>
                    <div>
                        <span className="text-yellow-400 text-sm font-semibold">
                            {movie.vote_average} ⭐
                        </span>
                    </div>
                </div>
                <div className="text-2xl font-semibold text-green-400 mb-6">
                    <strong>Price:</strong> ${movie.price}
                </div>
                <div className="flex justify-center">
                    <Button
                        onClick={addToCart}
                        variant="contained"
                        color="primary"
                        className="w-56 py-2 text-lg"
                    >
                        Add to Cart
                    </Button>
                </div>
                {cartMessage && (
                    <div className="mt-4 text-center text-yellow-400">
                        {cartMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailPage;
