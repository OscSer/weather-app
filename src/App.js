import './App.css';
import React, { useEffect, useState } from "react";
import WeatherCard from './components/WeatherCard';
import { Search } from 'semantic-ui-react';

export default function App() {
  const [coords, setCoords] = useState([]);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoords([
        {
          lat: position.coords.latitude,
          long: position.coords.longitude
        }
      ]);
    });
  }, []);

  return (
    <div className="App center">
      <Search
        onResultSelect={(e, data) => { }}
        onSearchChange={(e, data) => {
          setValue(data.value);
          setResults([]);
        }}
        results={results}
        value={value}
      />

      <div className='cards-container'>
        {coords.length > 0 && coords.map(coord => (
          <WeatherCard
            key={`${coord.lat}-${coord.long}`}
            coords={coord}
          />
        ))}
      </div>
    </div>
  );
}
