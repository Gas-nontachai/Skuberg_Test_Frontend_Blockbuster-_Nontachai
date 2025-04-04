"use client";
import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useAPI } from '@/hook/hooks';
import { Movie } from '@/misc/types';

const HomePage = () => {
  const { getMovieByAPI } = useAPI();

  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (searchQuery?: string) => {
    setLoading(true);
    try {
      const response = await getMovieByAPI();
      console.log(response);
      setMovies(response);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMovies(query);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* ช่องกรอกคำค้นหา */}
      <div className="flex justify-center mb-4">
        <TextField
          label="Search Movies"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<Search />}
          className="ml-2"
        >
          Search
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        // ถ้าไม่กำลังโหลด แสดงรายการหนัง
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.length > 0 ? (
            movies.map((movie: Movie) => (
              <div key={movie.movie_id} className="group relative cursor-pointer">
                {/* การ์ดหนัง */}
                <div className="w-full h-72 relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-xl transition-transform transform group-hover:scale-105"
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-center items-center h-full">
                      <h3 className="text-white text-lg font-bold">{movie.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
