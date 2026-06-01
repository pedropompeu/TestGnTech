CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    lat FLOAT,
    lon FLOAT,
    temperature FLOAT NOT NULL,
    feels_like FLOAT,
    temp_min FLOAT,
    temp_max FLOAT,
    pressure INTEGER,
    humidity INTEGER NOT NULL,
    wind_speed FLOAT,
    wind_deg INTEGER,
    rain_1h FLOAT,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weather_city ON weather_data(city);
