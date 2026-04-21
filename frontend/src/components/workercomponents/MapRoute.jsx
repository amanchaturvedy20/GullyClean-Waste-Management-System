
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon paths (needed for many bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:        require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:      require('leaflet/dist/images/marker-shadow.png'),
});

export default function MapRoute({ points = [], height = 400, zoom = 13 }) {
  // Default to first point or world view
  const center = points.length
    ? [points[0].location.lat, points[0].location.lng]
    : [20, 0];

  // Convert to [lat, lng] tuples for Polyline
  const route = points.map((p) => [p.location.lat, p.location.lng]);

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: `${height}px`, width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Draw the route line */}
      {route.length > 1 && <Polyline positions={route} color="blue" />}

      {/* Place markers */}
      {points.map((p) => (
        <Marker
          key={p.id}
          position={[p.location.lat, p.location.lng]}
        >
          <Popup>
            Bin #{p.id}<br />{p.location.lat.toFixed(4)}, {p.location.lng.toFixed(4)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
