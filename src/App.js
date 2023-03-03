import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

//[IMPORANT] Always have show the different states of response and request(load, show data, and error, etc) to the user

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //REMEMBER 'Try' is for await while 'catch' is used with then without async
  //fyi forgot that arrow functions don't hoist so can use function before its called
  //[important] no need for usecallback since the items don't change unless we call manuel click the button(also no dependencies showing at all)
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      //then to handle the response after the promise of fetch is fullfiled(since async may take awhile to get the run)
      const response = await fetch('https://swapi.dev/api/films/');

      if (!response.ok) {
        throw new Error('Something went wrong here!');
      }
      //[fyi] await is alt version for await since you waiting for this to finish then you can move on
      //Also great for readibility!
      const data = await response.json();
      //[fyi] no need for then block if you async await
      // .then((response) => {
      //   return response.json(); //fyi json() method returns a promise so we need to get the data thru then
      // })
      //[FYI]below, give request response url status success or error
      // console.log(response.status);

      const transformedMovies = data.results.map((item) => {
        return {
          id: item.episode_id,
          title: item.title,
          openingText: item.opening_crawl,
          releaseDate: item.release_date,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
    //[IMPORTANT] Best practice to list all the states  in the effect to the dependencies array, but functions no good since each time component rerenders function object reference value changes
    //causing an infinite loop
    //We just want to check if the fetchMovies has changed, only if changed, not at the start of the render like with an empty dependency
    //Solution: useCallBack method to check the cached function it's same not the ref value
  }, [fetchMoviesHandler]);
  //First write the logic of function
  let content = <p>No Movies Found XD</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  } else if (error) {
    content = <p>{error}</p>;
  } else if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && (
          <p>No Movies Found XD</p>
        )}
        {isLoading && <p>Loading...</p>}
        {di!isLoading && error && <p>{error}</p>} */}
        {content}
      </section>
    </>
  );
}

export default App;
