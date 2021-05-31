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
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(); //TODO: blur()
  const timeoutRef = useRef()

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
    const prevCities = window.localStorage.getItem('cities');
    if (prevCities) {
      setCities(JSON.parse(prevCities));
    } else {
      getCurrentPosition();
    }
  }, [])

  const generateKey = () => Math.random().toString(36).slice(2);

  const handleSearchChange = (e, data) => {
    clearTimeout(timeoutRef.current)
    setValue(data.value);
    setLoading(true);
    if (data.value) {
      timeoutRef.current = setTimeout(() => {
        const regExp = new RegExp(escapeRegExp(data.value), 'i');
        const isMatch = (result) => regExp.test(result.name);
        const filteredResults = filter(citiesResults, isMatch)
          .sort((a, b) => a.name.length - b.name.length)
          .map(result => ({
            ...result,
            title: `${result.name} (${result.country})`
          }));
        const uniqResults = uniqBy(filteredResults, 'title')
          .filter(result => !cities.find(city => city.coords === result.coord));
        setResults(uniqResults.splice(0, 6));
        setLoading(false);
      }, 500)
    } else {
      setLoading(false);
    }
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
    window.localStorage.setItem('cities', JSON.stringify(newCities));
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
            loading={loading}
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
