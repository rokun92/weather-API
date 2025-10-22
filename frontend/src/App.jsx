import React, { useState, useEffect } from 'react'

function App() {
    const [city, setCity] = useState('')
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [darkMode, setDarkMode] = useState(false)
    const [forecast, setForecast] = useState([])
    const [searchHistory, setSearchHistory] = useState([])
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    async function fetchWeather(searchCity) {
        const targetCity = searchCity || city
        if (!targetCity) return setError('Enter a city')
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`http://localhost:8080/weather?city=${encodeURIComponent(targetCity)}`)
            if (!res.ok) throw new Error('City not found')
            const json = await res.json()
            setData(json)

            if (!searchHistory.includes(targetCity)) {
                setSearchHistory([targetCity, ...searchHistory.slice(0, 4)])
            }

            setForecast(generateForecast(json.main?.temp))
        } catch (err) {
            setError(err.message)
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    function generateForecast(baseTemp) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        return days.map((day, i) => ({
            day,
            temp: Math.round(baseTemp + (Math.random() - 0.5) * 6),
            icon: ['01d', '02d', '03d', '04d', '10d'][Math.floor(Math.random() * 5)]
        }))
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            fetchWeather()
        }
    }

    // Styles object now primarily handles THEME (colors, gradients, etc.)
    // Layout styles (padding, margins, grid) have been moved to the <style> tag below
    const styles = {
        container: {
            background: darkMode
                ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'background 0.5s',
            position: 'relative',
            overflowX: 'hidden' // Prevent horizontal scroll
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: darkMode ? 'rgba(15, 12, 41, 0.8)' : 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
            position: 'sticky',
            top: 0,
            zIndex: 100
        },
        logo: {
            fontWeight: '700',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        searchContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        input: {
            padding: '12px 20px',
            borderRadius: '30px',
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
            color: darkMode ? 'white' : '#333',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        },
        button: {
            padding: '12px 28px',
            borderRadius: '30px',
            border: 'none',
            backgroundColor: darkMode ? '#667eea' : '#fff',
            color: darkMode ? 'white' : '#667eea',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
        },
        themeToggle: {
            padding: '10px 20px',
            borderRadius: '30px',
            border: 'none',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s'
        },
        mainContent: {
            display: 'grid',
            flex: 1
        },
        weatherCard: {
            backgroundColor: darkMode ? 'rgba(42, 42, 59, 0.6)' : 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: darkMode
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(31, 38, 135, 0.37)',
            color: 'white',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        },
        temperature: {
            fontWeight: '200',
            margin: '1rem 0',
            textShadow: '2px 2px 20px rgba(0,0,0,0.3)'
        },
        detailsGrid: {
            display: 'grid',
            width: '100%',
            marginTop: '2rem'
        },
        detailCard: {
            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`
        },
        sidebar: {
            display: 'flex',
            flexDirection: 'column',
        },
        sideCard: {
            backgroundColor: darkMode ? 'rgba(42, 42, 59, 0.6)' : 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: darkMode
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(31, 38, 135, 0.37)',
            color: 'white',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`
        },
        forecastItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            marginBottom: '0.5rem'
        },
        map: {
            width: '100%',
            borderRadius: '16px',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/800px-Equirectangular_projection_SW.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            overflow: 'hidden'
        },
        historyItem: {
            padding: '0.8rem 1rem',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            marginBottom: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '1px solid transparent'
        }
    }

    return (
        <div style={styles.container} className="app-container">
            <header style={styles.header} className="app-header">
                <div style={styles.logo} className="app-logo">
                    <span>⛅</span>
                    <span>WeatherPro</span>
                </div>

                <div style={styles.searchContainer} className="search-container">
                    <input
                        style={styles.input}
                        className="search-input"
                        placeholder="Search for cities..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button style={styles.button} className="search-button" onClick={() => fetchWeather()}>Search</button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: 'white', fontSize: '0.9rem' }}>
                        {currentTime.toLocaleTimeString()}
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        style={styles.themeToggle}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </header>

            <main style={styles.mainContent} className="main-content">
                <div>
                    {loading && (
                        <div style={styles.weatherCard} className="weather-card">
                            <div style={{ fontSize: '3rem' }}>🔄</div>
                            <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Loading weather data...</p>
                        </div>
                    )}

                    {error && (
                        <div style={styles.weatherCard} className="weather-card">
                            <div style={{ fontSize: '3rem' }}>❌</div>
                            <p style={{ fontSize: '1.5rem', marginTop: '1rem', color: '#ff6b6b' }}>{error}</p>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <div style={styles.weatherCard} className="weather-card">
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '300', margin: 0 }}>
                                {data.name}, {data.sys?.country}
                            </h2>
                            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginTop: '0.5rem' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>

                            <img
                                alt="weather"
                                src={`https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@4x.png`}
                                style={{ width: '150px', height: '150px', margin: '1rem 0' }}
                            />

                            <div style={styles.temperature} className="weather-temp">
                                {Math.round(data.main?.temp)}°C
                            </div>

                            <p style={{ fontSize: '1.5rem', textTransform: 'capitalize', opacity: 0.9 }}>
                                {data.weather?.[0]?.description}
                            </p>

                            <div style={styles.detailsGrid} className="details-grid">
                                <div style={styles.detailCard} className="detail-card">
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Feels Like</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '0.5rem' }}>
                                        {Math.round(data.main?.feels_like)}°C
                                    </div>
                                </div>
                                <div style={styles.detailCard} className="detail-card">
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Humidity</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '0.5rem' }}>
                                        {data.main?.humidity}%
                                    </div>
                                </div>
                                <div style={styles.detailCard} className="detail-card">
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Wind Speed</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '0.5rem' }}>
                                        {data.wind?.speed} m/s
                                    </div>
                                </div>
                                <div style={styles.detailCard} className="detail-card">
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Pressure</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '0.5rem' }}>
                                        {data.main?.pressure} hPa
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && !error && !data && (
                        <div style={styles.weatherCard} className="weather-card">
                            <div style={{ fontSize: '4rem' }}>🌍</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '300', marginTop: '1rem' }}>
                                Welcome to WeatherPro
                            </h2>
                            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginTop: '1rem' }}>
                                Search for any city to get started
                            </p>
                        </div>
                    )}
                </div>

                <div style={styles.sidebar} className="sidebar">
                    {forecast.length > 0 && (
                        <div style={styles.sideCard} className="side-card">
                            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: '600' }}>
                                5-Day Forecast
                            </h3>
                            {forecast.map((day, i) => (
                                <div key={i} style={styles.forecastItem}>
                                    <span style={{ fontWeight: '600' }}>{day.day}</span>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                                        alt="weather"
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                    <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{day.temp}°C</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={styles.sideCard} className="side-card">
                        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: '600' }}>
                            World Map
                        </h3>
                        <div style={styles.map} className="map">
                            {data && (
                                <div style={{
                                    position: 'absolute',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#ff6b6b',
                                    borderRadius: '50%',
                                    border: '3px solid white',
                                    boxShadow: '0 0 20px rgba(255,107,107,0.8)',
                                    animation: 'pulse 2s infinite'
                                }} />
                            )}
                        </div>
                    </div>

                    {searchHistory.length > 0 && (
                        <div style={styles.sideCard} className="side-card">
                            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: '600' }}>
                                Recent Searches
                            </h3>
                            {searchHistory.map((historyCity, i) => (
                                <div
                                    key={i}
                                    style={styles.historyItem}
                                    onClick={() => fetchWeather(historyCity)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)'
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)'
                                        e.currentTarget.style.borderColor = 'transparent'
                                    }}
                                >
                                    📍 {historyCity}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* --- STYLES & RESPONSIVENESS --- */}
            <style>{`
                /* --- Global Resets --- */
                body, html, #root {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }
                * {
                    box-sizing: border-box;
                }
                
                /* --- Base Layout Styles (Desktop) --- */
                .app-container {
                    min-height: 100vh;
                }
                .app-header {
                    padding: 1.5rem 3rem;
                    flex-direction: row;
                }
                .app-logo {
                    font-size: 1.8rem;
                }
                .search-container {
                    flex: 1;
                    max-width: 600px;
                    margin: 0 2rem;
                    flex-direction: row;
                }
                .search-input {
                    flex: 1;
                }
                .main-content {
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                    padding: 2rem 3rem;
                }
                .weather-card {
                    padding: 3rem;
                    min-height: 400px;
                }
                .weather-temp {
                    font-size: 6rem;
                }
                .details-grid {
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                }
                .detail-card {
                    padding: 1.5rem;
                }
                .sidebar {
                    gap: 2rem;
                }
                .side-card {
                    padding: 2rem;
                }
                .map {
                    height: 300px;
                }

                /* --- Tablet (<= 1024px) --- */
                @media (max-width: 1024px) {
                    .app-header {
                        padding: 1rem 2rem;
                    }
                    .main-content {
                        grid-template-columns: 1fr;
                        padding: 1.5rem 2rem;
                        gap: 1.5rem;
                    }
                    .weather-card {
                        padding: 2rem;
                        min-height: auto;
                    }
                    .weather-temp {
                        font-size: 5rem;
                    }
                    .sidebar {
                        gap: 1.5rem;
                    }
                }
                
                /* --- Mobile (<= 768px) --- */
                @media (max-width: 768px) {
                    .app-header {
                        flex-direction: column;
                        gap: 1rem;
                        padding: 1rem;
                        position: static; /* Un-stick header on mobile */
                    }
                    .search-container {
                        width: 95%;
                        margin: 0;
                    }
                    .main-content {
                        padding: 1rem;
                    }
                    .weather-card {
                        padding: 1.5rem;
                    }
                    .weather-temp {
                        font-size: 4rem;
                    }
                    .details-grid {
                        grid-template-columns: 1fr 1fr; /* 2-column on mobile */
                    }
                    .detail-card {
                        padding: 1rem;
                    }
                    .side-card {
                        padding: 1.5rem;
                    }
                    .map {
                        height: 250px;
                    }
                }
                
                /* --- Small Mobile (<= 480px) --- */
                @media (max-width: 480px) {
                    .search-container {
                        flex-direction: column;
                        gap: 0.5rem;
                        width: 100%;
                    }
                    .search-input, .search-button {
                        width: 100%;
                    }
                    .details-grid {
                        grid-template-columns: 1fr; /* 1-column on small screens */
                    }
                    .weather-temp {
                        font-size: 3.5rem;
                    }
                    .detail-card {
                        text-align: center;
                    }
                    .forecastItem {
                        padding: 0.5rem;
                    }
                }

                /* --- Animations --- */
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                }
                
                button:hover {
                    transform: translateY(-2px);
                }
                
                button:active {
                    transform: translateY(0);
                }
                
                input::placeholder {
                    opacity: 0.6;
                }
            `}</style>
        </div>
    )
}

export default App