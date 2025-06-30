import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  // Coordonnées
  const userPosition = [4.0725, 9.7281]; // Makepe (utilisateur simulé)
  const akwa = [4.0607, 9.7849];
  const bonamoussadi = [4.0806, 9.7403];
  const bali = [4.0519, 9.7738];

  // Trajet simulé
  const routeCoordinates = [
    userPosition,
    bonamoussadi,
    akwa,
    bali,
  ];

  return (
    <MapContainer
      center={[4.065, 9.76]} // Centre autour de Douala
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />

      {/* Position de l'utilisateur */}
      <Marker position={userPosition}>
        <Popup>Vous êtes ici (Makepe)</Popup>
      </Marker>

      {/* Marqueurs de quartiers */}
      <Marker position={akwa}>
        <Popup>Akwa : 1500 FCFA</Popup>
      </Marker>

      <Marker position={bonamoussadi}>
        <Popup>Bonamoussadi : 2000 FCFA</Popup>
      </Marker>

      <Marker position={bali}>
        <Popup>Bali : 1200 FCFA</Popup>
      </Marker>

      {/* Ligne entre les points */}
      <Polyline
        positions={routeCoordinates}
        pathOptions={{ color: "blue", weight: 3 }}
      />
    </MapContainer>
  );
};

export default MiniMap;
