import React from 'react';
import { Card } from 'semantic-ui-react'
import moment from 'moment';
import './WeatherCard.css';

const CardInfo = ({ description, value }) => {
    return (
        <div className='card__info'>
            <span>{`${description}:`}</span>
            <span className='card__info__value'>{value}</span>
        </div>
    )
}

const WeatherCard = ({ weatherData }) => (
    <Card className='card'>
        <Card.Header className="card__header center">City: {weatherData.name}</Card.Header>
        <Card.Content>
            <CardInfo description='Day' value={moment().format('dddd')} />
            <CardInfo description='Date' value={moment().format('LL')} />
            <CardInfo description='Temprature' value={`${weatherData.main.temp} °C`} />
            <CardInfo description='Sunrise' value={new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-IN')} />
            <CardInfo description='Sunset' value={new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-IN')} />
            <CardInfo description='Description' value={weatherData.weather[0].main} />
            <CardInfo description='Humidity' value={weatherData.main.humidity} />
        </Card.Content>
    </Card>
)

export default WeatherCard;
