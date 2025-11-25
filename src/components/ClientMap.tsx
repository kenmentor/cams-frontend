"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icons (Next.js breaks them by default)
const defaultIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function ClientMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Location error:", err);
          alert("Failed to get your location.");
        }
      );
    }
  }, []);

  if (!position) {
    return (
      <div className="p-4 text-center text-lg">Getting your location…</div>
    );
  }

  return (
    <div className="w-full h-[500px]">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={defaultIcon}>
          <Popup>You are here</Popup>
        </Marker>

        <Recenter center={position} />
      </MapContainer>
    </div>
  );
}
