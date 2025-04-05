"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { TextField, Button, CircularProgress, Badge, IconButton, Pagination } from '@mui/material';
import { Search, AddShoppingCart, ShoppingCart } from '@mui/icons-material';
import { useAPI } from '@/hook/hooks';
import { Movie, Cart } from '@/misc/types';
import Link from 'next/link';
import CartDetail from '@/app/components/Cart/Cart';
import Swal from 'sweetalert2';

const HomePage = () => {
  const { getMovieByAPI } = useAPI();

  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [carts, setCarts] = useState<{ movie_id: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMovies = React.useCallback(async (searchQuery?: string) => {
    setLoading(true);
    try {
      const response = await getMovieByAPI(currentPage, searchQuery);
      setMovies(response);
    } catch (err) {
      console.error('Error fetching movie data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchCart = React.useCallback(async () => {
    const carts = JSON.parse(localStorage.getItem('cart') || '[]');
    setCarts(carts);
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMovies(query);
  };

  const handlePagination = (page: number) => {
    localStorage.setItem('currentPage', page.toString());
    setCurrentPage(page);
  };

  const addToCart = async (movieId: string) => {
    const cart_item: Cart = { movie_id: movieId };
    const existing_cart: Cart[] = JSON.parse(localStorage.getItem('cart') || '[]');

    const isMovieInCart = existing_cart.some((item) => item.movie_id === movieId);

    if (isMovieInCart) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'This movie is already in the cart!',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const updated_cart = [...existing_cart, cart_item];
      localStorage.setItem('cart', JSON.stringify(updated_cart));
      fetchCart();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Added to cart successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('currentPage')) {
      setCurrentPage(Number(localStorage.getItem('currentPage')));
    }
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans">
      <div className='w-8/12 mx-auto'>
        <header className="text-center py-6 relative">
          <h1 className="text-5xl font-extrabold text-yellow-500 drop-shadow-lg uppercase">
            🎬 Blockbuster Cinema
          </h1>
          <p className="text-gray-300 mt-2 text-xl">Indulge in exciting movies!</p>
          <div
            className="absolute right-4 top-4 h-full min-w-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link href="/cart/detail">
              <IconButton color="inherit">
                <Badge badgeContent={carts.length} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Link>
            {isHovered && (
              <div className="absolute right-2 top-16 z-10 w-80">
                <CartDetail onComplete={() => { fetchCart(); }} />
              </div>
            )}
          </div>
        </header>

        <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 mb-8">
          <TextField
            label="ค้นหาหนัง"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            InputProps={{
              style: {
                backgroundColor: '#fff',
                borderRadius: '8px',
                fontWeight: 'bold',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            startIcon={<Search />}
            sx={{ fontWeight: 'bold' }}
          >
            ค้นหา
          </Button>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8 mx-auto max-w-2xl flex justify-center items-center gap-4">
          <Pagination
            count={99}
            page={currentPage}
            variant="outlined"
            shape="rounded"
            onChange={(event, value) => handlePagination(value)}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#fff',
              },
              '& .MuiPaginationItem-ellipsis': {
                color: '#fff',
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#fff',
                color: '#000',
              },
            }}
          />
        </div>

        {
          loading ? (
            <div className="flex justify-center py-20">
              <CircularProgress color="secondary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 pb-12">
              {movies.length > 0 ? (
                movies.map((movie: Movie) => (
                  <div
                    key={movie.movie_id}
                    className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all transform hover:-translate-y-1 hover:scale-105 hover:bg-gray-700 hover:shadow-xl duration-300"
                  >
                    <Link href={`/movie/detail?movie_id=${movie.movie_id}`}>
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={500}
                        height={288}
                        className="w-full h-72 object-cover"
                      />
                    </Link>
                    <div className="p-4 flex flex-col justify-between h-48">
                      <h3
                        className={`text-xl font-semibold mb-2 text-yellow-300 line-clamp-2 ${movie.title ? 'font-bold' : ''
                          }`}
                      >
                        {movie.title}
                      </h3>
                      <span className="text-yellow-400 text-sm font-semibold">
                        {movie.vote_average} ⭐
                      </span>
                      <p className="text-sm text-gray-400 line-clamp-3">{movie.overview}</p>
                      <div className="mt-auto flex justify-between items-center pt-4">
                        <span className="text-yellow-300 font-bold text-lg">
                          ${movie.price}
                        </span>
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          startIcon={<AddShoppingCart />}
                          onClick={() => addToCart(movie.movie_id)}
                        >
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No movies found</p>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default HomePage;
