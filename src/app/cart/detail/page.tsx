"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { useAPI } from '@/hook/hooks';
import { Movie } from '@/misc/types';
import { IconButton, Button, Breadcrumbs, Chip } from '@mui/material';
import { Home, Delete } from '@mui/icons-material';
import PurchaseDialog from '@/app/components/Purchase/Purchase';
import Swal from 'sweetalert2';

const CartDetailPage = () => {
    const { getMovieByIDAPI } = useAPI();
    const [cartItems, setCartItems] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

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
        } catch (err) {
            console.error(err);
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
    };

    const handleCancelPurchase = () => {
        setOpenDialog(false);
        fetchCartDetails();
        Swal.fire({
            title: 'Purchase Failed',
            text: 'An unexpected error occurred.',
            icon: 'error',
            toast: true,
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    const handleCompletePurchase = () => {
        setOpenDialog(false);
        localStorage.removeItem('cart');
        fetchCartDetails();
        Swal.fire({
            title: 'Thank you for your purchase!',
            text: 'Your transaction has been completed successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
        }).then(() => {
            window.location.href = "/";
        });

    };

    const isCartEmpty = cartItems.length === 0;

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <div className="spinner-border animate-spin border-t-4 border-yellow-500 border-solid rounded-full w-12 h-12"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
            <div className='w-6/12 mx-auto'>
                <Breadcrumbs aria-label="breadcrumb" className="text-white mb-6" color="warning">
                    <Chip
                        onClick={() => { window.location.href = "/" }}
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
                <div className="flex-grow mt-10">
                    <h3 className="text-xl font-semibold mb-4">Cart Details</h3>
                    <div className="space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item: Movie, index: number) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-md text-xs">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                        alt={item.title}
                                        width={200}
                                        height={220}
                                        className="w-16 h-22 object-cover rounded mr-4"
                                    />
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-lg truncate">{item.title}</h4>
                                    </div>
                                    <span className="text-yellow-300 font-semibold">${item.price}</span>
                                    <IconButton
                                        onClick={() => removeMovie(item.movie_id)}
                                        className="ml-4"
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
                </div>
                <div className="mt-6 w-full">
                    <Button
                        onClick={() => {
                            if (!isCartEmpty) {
                                setOpenDialog(true);
                            }
                        }}
                        variant="contained"
                        color="primary"
                        className="w-full py-3 text-lg"
                        disabled={isCartEmpty}
                    >
                        Purchase
                    </Button>
                </div>
            </div>
            {openDialog && (
                <PurchaseDialog
                    price={finalTotal}
                    onClose={handleCancelPurchase}
                    onComplete={handleCompletePurchase}
                />
            )}
        </div>
    );
};

export default CartDetailPage;
