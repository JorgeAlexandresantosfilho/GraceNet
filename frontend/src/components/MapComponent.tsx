import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getClientes, getAllPops } from '../services/api';
import type { Cliente, Pop } from '../types';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const clientIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const popIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapComponent: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [pops, setPops] = useState<Pop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesData, popsData] = await Promise.all([
                    getClientes(),
                    getAllPops()
                ]);
                setClientes(clientesData);
                setPops(popsData);
            } catch (error) {
                console.error("Erro ao carregar dados do mapa:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Carregando mapa...</div>;
    }

    // Default center (Brazil or specific region)
    // If we have data, center on the first valid point
    const validPoints = [...clientes, ...pops].filter(p => p.latitude && p.longitude);
    const center: [number, number] = validPoints.length > 0
        ? [validPoints[0].latitude!, validPoints[0].longitude!]
        : [-23.550520, -46.633308]; // São Paulo default

    return (
        <div className="h-[calc(100vh-100px)] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {clientes.map(cliente => (
                    cliente.latitude && cliente.longitude && (
                        <Marker
                            key={`cli-${cliente.id}`}
                            position={[cliente.latitude, cliente.longitude]}
                            icon={clientIcon}
                        >
                            <Popup>
                                <strong>Cliente:</strong> {cliente.nomeCompleto}<br />
                                <strong>Plano:</strong> {cliente.plano}<br />
                                <strong>Status:</strong> {cliente.status}
                            </Popup>
                        </Marker>
                    )
                ))}

                {pops.map(pop => (
                    pop.latitude && pop.longitude && (
                        <Marker
                            key={`pop-${pop.id_torre}`}
                            position={[pop.latitude, pop.longitude]}
                            icon={popIcon}
                        >
                            <Popup>
                                <strong>POP:</strong> {pop.localizacao}<br />
                                <strong>IP:</strong> {pop.ip_gerenciamento}
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
