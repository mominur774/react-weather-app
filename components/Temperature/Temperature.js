import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDehaze } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_ID } from '../Environment/Environment';

const Temperature = () => {
    const [weather, setWeather] = useState({});
    const [formData, setFormData] = useState({});
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [isWeather, setIsWeather] = useState(false);
    const [location, setLocation] = useState({
        'latitude': '',
        'longitude': ''
    })

    const searchByCity = () => {
        setCity(formData)
    }

    const showPosition = (position) => {
        setLocation({
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        })
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }, [])

    useEffect(() => {
        var url = ""
        if (city) {
            url = `${NEXT_PUBLIC_API_URL}?q=${city}&appid=${NEXT_PUBLIC_APP_ID}&units=metric`
        } else if (location.latitude && location.longitude) {
            url = `${NEXT_PUBLIC_API_URL}?lat=${location.latitude}&lon=${location.longitude}&appid=${NEXT_PUBLIC_APP_ID}&units=metric`
        }
        axios.get(url).then(res => {
            setIsWeather(true);
            setWeather(res.data);
            setError("");
        }).catch(error => {
            setError(error.response.data.message)
        })
    }, [city, location])
    return (
        <div className="row">
            <div className="col-lg-6 col-md-8 col-sm-10 temperature p-5">
                <div className='mb-5'>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter city name"
                            onChange={(e) => setFormData(e.target.value)}
                        />
                        <span onClick={searchByCity} className="input-group-text" id="basic-addon2"><BiSearch /></span>
                    </div>
                    <p className='error text-center'><b>{error && error}</b></p>
                </div>
                {isWeather ? (
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            <h2>{weather?.name}, {weather?.sys?.country}</h2>
                            <div className='weather'>
                                {weather?.weather?.length && weather.weather.map((w, i) => (
                                    <p key={i}>
                                        <img src={`http://openweathermap.org/img/w/${w.icon}.png`} alt="" />
                                        <span>{w.main}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className='fs-2'><b>{parseInt(weather?.main?.temp)} &#8451;</b></p>
                            <div className="feels_like">
                                <p className=''>Feels like {parseInt(weather?.main?.feels_like)} &#8451;</p>
                                <p className=''>Humidity {weather?.main?.humidity}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                )}
            </div>
        </div>
    )
}

export default Temperature;