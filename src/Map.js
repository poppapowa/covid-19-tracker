import React from 'react';
import "./Map.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { renderDataOnMap } from "./util";

function Map({ countries, casesType, center, zoom}) {
  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }
  return (
    <div className="map">
      <MapContainer
        casesType={casesType}
        className="map"
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Loop through countries and draw circles on screen */}
        {renderDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map
