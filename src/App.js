import './App.css';
import React, { useEffect, useState, useRef } from "react";
import WeatherCard from './components/WeatherCard';
import { Search, Container, Button, Ref } from 'semantic-ui-react';
import cities from './utils/cities.json';
import { filter, escapeRegExp, uniqBy } from 'lodash';

export default function App() {
  const [coords, setCoords] = useState([]);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCoords([{
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }]);
      });
    };
    const prevCoords = window.localStorage.getItem('weather-app-coords');
    if (prevCoords) {
      setCoords(JSON.parse(prevCoords));
    } else {
      getCurrentPosition();
    }
  }, []);

  const clearSearch = () => setValue('');

  const onSearchChange = (e, data) => {
    setValue(data.value);
    const regExp = new RegExp(escapeRegExp(data.value), 'i');
    const isMatch = (city) => regExp.test(city.name);
    const filteredCities = filter(cities, isMatch)
      .sort((a, b) => a.name.length - b.name.length)
      .map(city => ({
        ...city,
        title: `${city.name} (${city.country})`
      }));
    const uniqCities = uniqBy(filteredCities, 'title')
      .filter(city => !coords.includes(city.coord));
    setResults(uniqCities.splice(0, 6));
  }

  const onResultSelect = (e, data) => {
    const newCoords = [{ ...data.result.coord, key: generateKey() }, ...coords];
    setCoords(newCoords);
    window.localStorage.setItem('weather-app-coords', JSON.stringify(newCoords));
    clearSearch();
  }

  const onButtonClick = () => {
    setCoords(coords.map(coord => ({ ...coord, key: generateKey() })));
  }

  const generateKey = () => Math.random().toString(36).slice(2);

  return (
    <div className="App">
      <Container>

        <div className="search-container">
          <Ref innerRef={searchRef}>
            <Search
              placeholder='Search more cities...'
              onResultSelect={onResultSelect}
              onSearchChange={onSearchChange}
              results={results}
              value={value}
              onFocus={clearSearch}
              ref={searchRef}
            />
          </Ref>

          <Button
            circular
            color='facebook'
            size='big'
            className='refresh-button'
            content='Refresh'
            icon='refresh'
            onClick={onButtonClick}
          />
        </div>

        <div className='cards-container'>
          {coords.length > 0 && coords.map(coord => (
            <WeatherCard
              key={`${coord.lat}-${coord.lon}-${coord.key}`}
              coords={coord}
            />
          ))}
        </div>

      </Container>
    </div>
  );
}
