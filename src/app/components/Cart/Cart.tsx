import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import { ShoppingCart, Delete } from '@mui/icons-material';
import { useAPI } from '@/hook/hooks';
import { Movie } from '@/misc/types';
import { IconButton, Button } from '@mui/material';
import Swal from 'sweetalert2';

const CartDetail = ({ onComplete }: { onComplete: () => void }) => {
    const { getMovieByIDAPI } = useAPI();
    const [cartItems, setCartItems] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fetchCartDetails = async () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            setLoading(false);
            return;
        }

        const moviePromises = cart.map((item: { movie_id: string }) => getMovieByIDAPI(item.movie_id));
        try {
            const movies = await Promise.all(moviePromises);
            setCartItems(movies);
            const totalPrice = movies.reduce((sum: number, movie: Movie) => sum + (movie.price ?? 0), 0);
            setTotal(totalPrice);
            const cartLength = movies.length;
            if (cartLength > 5) {
                setDiscount(0.2);
            } else if (cartLength > 3) {
                setDiscount(0.1);
            } else {
                setDiscount(0);
            }
        } catch (error) {
            setError('There was an error fetching the cart details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartDetails();
    }, []);

    useEffect(() => {
        const discountAmount = total * discount;
        setFinalTotal(total - discountAmount);
        if (discount === 0) {
            const remainingFor10 = 4 - cartItems.length;
            const remainingFor20 = 6 - cartItems.length;

            if (cartItems.length < 4) {
                setMessage(`Add ${remainingFor10} more item(s) to get a 10% discount.`);
            } else if (cartItems.length < 6) {
                setMessage(`Add ${remainingFor20} more item(s) to get a 20% discount.`);
            }
        } else {
            setMessage('');
        }
    }, [total, discount, cartItems.length]);

    const removeMovie = (movieId: string) => {
        const updatedCart = cartItems.filter(item => item.movie_id !== movieId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        fetchCartDetails();
        onComplete();
    };

    const clearCart = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will clear all items in your cart.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Cart cleared successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                localStorage.removeItem('cart');
                setCartItems([]);
                onComplete();
                setTotal(0);
                setDiscount(0);
                setFinalTotal(0);
            }
        });
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin border-t-4 border-yellow-500 border-solid rounded-full w-12 h-12"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded-md shadow-md bg-gray-900 text-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Cart Details</h3>
                <Button
                    variant="text"
                    color="error"
                    className="py-2 text-lg"
                    startIcon={<Delete />}
                    onClick={clearCart}
                >
                    Clear Cart
                </Button>
            </div>
            <div className="space-y-4">
                {cartItems.length > 0 ? (
                    cartItems.map((item: Movie, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded shadow text-xs">
                            <Image
                                src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                alt={item.title}
                                width={200}  
                                height={140}  
                                className="w-10 h-14 object-cover rounded mr-2"
                            />
                            <div className="flex-grow">
                                <h4 className="font-semibold truncate">{item.title}</h4>
                            </div>
                            <span className="text-yellow-300 font-semibold">${item.price}</span>
                            <IconButton
                                onClick={() => removeMovie(item.movie_id)}
                                className="ml-2"
                                color="error"
                            >
                                <Delete />
                            </IconButton>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-lg text-gray-400">
                        <p>Your cart is empty. Browse our movies and add some items!</p>
                    </div>
                )}
                <hr className="my-4 border-gray-500" />

                {discount > 0 && (
                    <div className="text-green-400 font-semibold">
                        <p>Discount: {discount * 100}%</p>
                        <p>Discount Amount: ${(total * discount).toFixed(2)}</p>
                    </div>
                )}

                {message && (
                    <div className="text-yellow-300 font-semibold mt-4">
                        <p>{message}</p>
                    </div>
                )}

                <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Add the Purchase and Clear Cart buttons */}
            <div className="mt-6 space-y-4">
                <Link href="/cart/detail" passHref>
                    <Button
                        variant="contained"
                        color="primary"
                        className="w-full py-3 text-lg"
                        startIcon={<ShoppingCart />}
                    >
                        Purchase
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default CartDetail;
