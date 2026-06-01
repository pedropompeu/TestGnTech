import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

interface BackgroundMapProps {
  center: [number, number];
}

function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  const prev = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (prev.current === null || prev.current[0] !== center[0] || prev.current[1] !== center[1]) {
      map.flyTo(center, 8, { duration: 1.5, easeLinearity: 0.25 });
      prev.current = center;
    }
  }, [center, map]);

  return null;
}

export const BackgroundMap: React.FC<BackgroundMapProps> = ({ center }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        filter: 'grayscale(1)',
        opacity: 0.55,
      }}
    >
      <MapContainer
        center={[-15, -50]}
        zoom={3}
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        keyboard={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />
        <TileLayer
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`}
          opacity={0.4}
        />
        <FlyTo center={center} />
      </MapContainer>
    </div>
  );
};
