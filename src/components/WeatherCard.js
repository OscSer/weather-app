import React, { useEffect, useState } from "react";
import moment from 'moment';
import './WeatherCard.css';
import { Dimmer, Loader, Segment, Card } from 'semantic-ui-react';

const CardInfo = ({ description, value }) => (
    <div className='card__info'>
        <span>{`${description}:`}</span>
        <span className='card__info__value'>{value}</span>
    </div>
)

const WeatherCard = ({ coords }) => {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const { lat, long } = coords;
            await fetch(`${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`)
                .then(result => result.json())
                .then(json => {
                    setData(json)
                });
        }
        fetchData();
    }, [coords])

    return data.main
        ? (
            <Card className='card'>
                <Card.Header className="card__header center">
                    City: {data.name}
                </Card.Header>
                <Card.Content>
                    <CardInfo description='Day' value={moment().format('dddd')} />
                    <CardInfo description='Date' value={moment().format('LL')} />
                    <CardInfo description='Temprature' value={`${data.main.temp} °C`} />
                    <CardInfo description='Sunrise' value={new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN')} />
                    <CardInfo description='Sunset' value={new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN')} />
                    <CardInfo description='Description' value={data.weather[0].main} />
                    <CardInfo description='Humidity' value={data.main.humidity} />
                </Card.Content>
            </Card>
        )
        : (
            <Segment className='card'>
                <Dimmer active>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>
            </Segment>
        )
}

export default WeatherCard;
