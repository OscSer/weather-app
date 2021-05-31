import './App.css';
import React, { useEffect, useState, useRef } from "react";
import WeatherCard from './components/WeatherCard';
import { Search, Container, Button } from 'semantic-ui-react';
import citiesResults from './utils/cities.json';
import { filter, escapeRegExp, uniqBy, remove } from 'lodash';

export default function App() {
  const [cities, setCities] = useState([]);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');
  const searchRef = useRef(null); //TODO: blur()

  useEffect(() => {
    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCities([{
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          },
          key: generateKey()
        }]);
      });
    };
    const prevCities = window.localStorage.getItem('weather-app-cities');
    if (prevCities) {
      setCities(JSON.parse(prevCities));
    } else {
      getCurrentPosition();
    }
  }, []);

  const generateKey = () => Math.random().toString(36).slice(2);

  const handleSearchChange = (e, data) => { //TODO: debounce
    setValue(data.value);
    const regExp = new RegExp(escapeRegExp(data.value), 'i');
    const isMatch = (city) => regExp.test(city.name);
    const filteredCities = filter(citiesResults, isMatch)
      .sort((a, b) => a.name.length - b.name.length)
      .map(city => ({
        ...city,
        title: `${city.name} (${city.country})`
      }));
    const uniqCities = uniqBy(filteredCities, 'title')
      .filter(result => !cities.find(city => city.coords === result.coord));
    setResults(uniqCities.splice(0, 6));
  }

  const handleResultSelect = (e, data) => {
    const newCities = [
      {
        coords: { ...data.result.coord },
        key: generateKey()
      },
      ...cities
    ];
    setCities(newCities);
    window.localStorage.setItem('weather-app-cities', JSON.stringify(newCities));
    setValue('');
  }

  const handleRefresh = () => {
    setCities(cities.map(city => ({ ...city, key: generateKey() })));
  }

  const handleCloseAction = (key) => {
    let newCities = [...cities];
    remove(newCities, city => city.key === key);
    setCities(newCities);
  }

  return (
    <div className="App">
      <Container>

        <div className="search-container">
          <Search
            placeholder='Search more cities...'
            onResultSelect={handleResultSelect}
            onSearchChange={handleSearchChange}
            results={results}
            value={value}
            ref={searchRef}
          />
          <Button
            circular
            color='facebook'
            size='big'
            className='refresh-button'
            content='Refresh'
            icon='refresh'
            onClick={handleRefresh}
          />
        </div>

        <div className='cards-container'>
          {cities.length > 0 && cities.map(city => (
            <WeatherCard
              id={city.key}
              key={city.key}
              coords={city.coords}
              onCloseAction={handleCloseAction}
            />
          ))}
        </div>

      </Container>
    </div>
  );
}
