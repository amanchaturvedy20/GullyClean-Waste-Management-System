import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/adminService';

// Custom Map Icons
const workerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultCenter = [28.6139, 77.2090]; // Default to New Delhi if no workers have active location

const LiveOperationsMap = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});

    // 1. Fetch worker states every 30 seconds to get updated locations
    const { data: workerStats = [], isLoading } = useQuery({
        queryKey: ['adminWorkerStatsMap'],
        queryFn: adminService.getWorkerStats,
        refetchInterval: 30000 // auto refresh every 30s
    });

    const activeWorkersWithLocation = workerStats.filter(ws => 
        ws.worker?.location?.lat && ws.worker?.location?.lng
    );

    // Initialize map ONCE
    useEffect(() => {
        if (!mapRef.current) return;

        // Clean up previous instance if strict mode double-invokes
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
        }

        const center = activeWorkersWithLocation.length > 0 
            ? [activeWorkersWithLocation[0].worker.location.lat, activeWorkersWithLocation[0].worker.location.lng] 
            : defaultCenter;

        const map = L.map(mapRef.current, {
            zoomControl: false // Add cleanly below if needed
        }).setView(center, 13);
        
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            className: 'map-tiles'
        }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    // We strictly only ever want to run the initialization ONCE
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync markers whenever worker data updates
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Keep track of which IDs are currently active
        const activeIds = new Set(activeWorkersWithLocation.map(ws => ws.worker._id));

        // Remove markers that are no longer active
        Object.keys(markersRef.current).forEach(id => {
            if (!activeIds.has(id)) {
                map.removeLayer(markersRef.current[id]);
                delete markersRef.current[id];
            }
        });

        // Add or update markers based on latest data
        activeWorkersWithLocation.forEach(ws => {
            const latLng = [ws.worker.location.lat, ws.worker.location.lng];
            const id = ws.worker._id;

            const popupContent = `
                <div class="p-1">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <img src="https://ui-avatars.com/api/?name=${ws.worker.name?.replace(/\s/g, '+')}&background=8b5cf6&color=fff&bold=true" class="rounded-full w-full h-full" alt="avatar" />
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900 border-none m-0 p-0 text-lg leading-tight">${ws.worker.name}</h4>
                            <span class="text-xs font-bold uppercase tracking-widest text-purple-600 block mt-0.5">Active Operator</span>
                        </div>
                    </div>
                    <div class="space-y-1.5 pt-3 border-t border-gray-100 mt-1">
                        <p class="text-sm font-medium text-gray-600 m-0 flex justify-between items-center">
                            <span>Tasks Resolved:</span> 
                            <span class="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">${ws.dailyCompleted}</span>
                        </p>
                        <p class="text-sm font-medium text-gray-600 m-0 flex justify-between items-center">
                            <span>Assigned tasks:</span> 
                            <span class="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">${ws.dailyAssigned}</span>
                        </p>
                        <p class="text-[10px] text-gray-400 font-bold tracking-wider m-0 mt-3 pt-2 border-t border-gray-50 flex items-center justify-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${new Date(ws.worker.location.lastUpdated).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            `;

            if (markersRef.current[id]) {
                // Update position and popup content
                markersRef.current[id].setLatLng(latLng);
                markersRef.current[id].getPopup().setContent(popupContent);
            } else {
                // Create new marker
                const marker = L.marker(latLng, { icon: workerIcon })
                    .bindPopup(popupContent, { className: 'custom-popup' })
                    .addTo(map);
                markersRef.current[id] = marker;
            }
        });
        
    }, [activeWorkersWithLocation]);

    return (
        <div className="bg-[#131B2F] rounded-3xl p-6 lg:p-8 border border-white/5 shadow-2xl relative mt-8">
            <style>{`
                .map-tiles { filter: brightness(0.9) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7); }
                .leaflet-container { background: #0B1121 !important; z-index: 0; font-family: inherit; }
                .custom-popup .leaflet-popup-content-wrapper { border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); padding: 4px; }
                .custom-popup .leaflet-popup-tip { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
                .leaflet-popup-close-button { top: 12px !important; right: 12px !important; color: #9ca3af !important; }
                .leaflet-control-zoom { border: none !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; overflow: hidden; border-radius: 8px !important; }
                .leaflet-control-zoom a { background-color: #1e293b !important; color: #cbd5e1 !important; border-bottom-color: #334155 !important; }
                .leaflet-control-zoom a:hover { background-color: #334155 !important; color: #fff !important; }
            `}</style>
            
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                    <Navigation className="text-blue-400 w-7 h-7" /> Real-Time Fleet Map
                </h3>
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span> Live Tracking
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-inner h-[500px] z-0 relative isolation-auto">
                {/* Native DOM element for Leaflet */}
                <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
                
                {activeWorkersWithLocation.length === 0 && !isLoading && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center pointer-events-none">
                        <MapPin className="text-gray-400 w-12 h-12 mb-3" />
                        <h4 className="text-white font-bold text-lg">No Active GPS Signals</h4>
                        <p className="text-gray-400 text-sm mt-1">Pending location pings from worker devices...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveOperationsMap;
