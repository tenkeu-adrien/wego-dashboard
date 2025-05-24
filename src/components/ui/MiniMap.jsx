import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import { useEffect } from "react";

// Corriger l'icône par défaut de Leaflet (sinon elle ne s'affiche pas correctement dans React)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix pour que Leaflet fonctionne correctement dans React + Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MiniMap = () => {
  return (
    <MapContainer
      center={[46.603354, 1.888334]} // Coordonnées de la France
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />
      <Marker position={[48.8566, 2.3522]}>
        <Popup>Paris : €1200</Popup>
      </Marker>
      <Marker position={[43.6108, 3.8767]}>
        <Popup>Montpellier : €750</Popup>
      </Marker>
      <Marker position={[45.7640, 4.8357]}>
        <Popup>Lyon : €450</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MiniMap;
