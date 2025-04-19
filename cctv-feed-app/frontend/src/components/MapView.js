import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapView({ onSelectCamera }) {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/cameras')
      .then((res) => res.json())
      .then((data) => setCameras(data))
      .catch((err) => console.error('Failed to fetch cameras:', err));
  }, []);

  return (
    <MapContainer
      center={[39.8283, -98.5795]} // Center of USA
      zoom={4}
      style={{ height: '400px', width: '100%' }}
      className="rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map((camera) => (
        <Marker
          key={camera.id}
          position={[camera.latitude, camera.longitude]}
          eventHandlers={{
            click: () => {
              onSelectCamera(camera);
            },
          }}
        >
          <Popup>{camera.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
