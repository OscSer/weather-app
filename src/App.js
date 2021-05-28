import './App.css';
import React, { useEffect, useState } from "react";
import WeatherCard from './components/WeatherCard';
import { Search, Container } from 'semantic-ui-react';
import cities from './utils/city.list.min.json';
import { filter, escapeRegExp, uniqBy } from 'lodash';

export default function App() {
  const [coords, setCoords] = useState([]);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('Try more cities...');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoords([{
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }]);
    });
  }, []);

  const clearSearch = () => {
    setValue('');
  }

  const onSearchChange = (e, data) => {
    setValue(data.value);
    const regExp = new RegExp(escapeRegExp(data.value), 'i');
    const isMatch = (city) => regExp.test(city.name);
    const filteredCities = filter(cities, isMatch)
      .sort((a, b) => a.name.length - b.name.length)
      .map(city => ({ ...city, title: `${city.name} (${city.country})` }));
    const uniqCities = uniqBy(filteredCities, 'title')
      .filter(city => !coords.includes(city.coord));
    setResults(uniqCities.splice(0, 10));
  }

  const onResultSelect = (e, data) => {
    setCoords([data.result.coord, ...coords]);
    clearSearch();
  }

  return (
    <div className="App center">
      <Container>
        <div className="search-container center">
          <Search
            onResultSelect={onResultSelect}
            onSearchChange={onSearchChange}
            results={results}
            value={value}
            onFocus={clearSearch}
          />
        </div>
        <div className='cards-container'>
          {coords.length > 0 && coords.map(coord => (
            <WeatherCard
              key={`${coord.lat}-${coord.lon}`}
              coords={coord}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
