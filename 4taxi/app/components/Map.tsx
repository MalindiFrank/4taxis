'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { memo, useEffect, useRef } from 'react';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
  hand_signal: string;
}

interface MapProps {
  stops: Stop[];
}

function Map({ stops }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const positions = stops.map(stop => [stop.lat, stop.lon] as [number, number]);
      if (positions.length > 0) {
        mapInstance.current = L.map(mapRef.current).setView(positions[0], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance.current);

        stops.forEach(stop => {
          L.marker([stop.lat, stop.lon])
            .addTo(mapInstance.current!)
            .bindPopup(`<b>${stop.name}</b><br />${stop.hand_signal}`);
        });

        L.polyline(positions, { color: 'blue' }).addTo(mapInstance.current);
      }
    }
  }, [stops]);

  if (stops.length === 0) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#EAEAEA',
          color: 'black',
        }}
      >
        No stops to display on map.
      </div>
    );
  }

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}

export default memo(Map);