import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../supabaseClient";

const MapWithTable = () => {
  const [estaciones, setEstaciones] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase
        .from('measumerent')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error", error);
      } else {
        console.log("Datos:", data);
        setEstaciones(data);
      }
    };

    fetchTables();
  }, []);

 // Coordenadas de la Facultad de Telemática, ajusta según sea necesario

  const customIcon = new L.Icon({
    iconUrl: "https://e7.pngegg.com/pngimages/363/769/png-clipart-location-icon-landmark-map.png", // Ruta a tu icono personalizado
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div style={{ display: "flex" }}>
      <MapContainer
        center={{lat: 19.240601, lng:-103.711998} }
        zoom={16}
        style={{ height: "620px", width: "60%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {estaciones.map((estacion) => (
          <Marker
            icon={customIcon}
            position={[estacion.latitude, estacion.longitude]}
           
          >
            <Popup>
              <div>
                <h3>Estación Meteorológica</h3>
                <p>ID: {estacion.id}</p>
                <p>Temperatura: {estacion.temperature}</p>
                <p>Humedad: {estacion.humidity}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div style={{ flex: 1, marginLeft: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>Últimos 10 Valores de la Estación Meteorológica</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign:'center' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle} >ID</th>
              <th style={tableHeaderStyle}>Creación</th>
              <th style={tableHeaderStyle}>ID Estación</th>
              <th style={tableHeaderStyle}>Latitud</th>
              <th style={tableHeaderStyle}>Longitud</th>
              <th style={tableHeaderStyle}>Temperatura</th>
              <th style={tableHeaderStyle}>Humedad</th>
            </tr>
          </thead>
          <tbody>
            {estaciones.map((estacion) => (
              <tr key={estacion.id} style={tableRowStyle}>
                <td>{estacion.id}</td>
                <td>{estacion.created_at}</td>
                <td>{estacion.station_id}</td>
                <td>{estacion.latitude}</td>
                <td>{estacion.longitude}</td>
                <td>{estacion.temperature}</td>
                <td>{estacion.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  padding: "12px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
 
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
  padding: "12px",
  backgroundColor: "#fff",
  textAlign: "center",
};


export default MapWithTable;
