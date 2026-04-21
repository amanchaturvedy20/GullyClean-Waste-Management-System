import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';

const useWorkerLocation = () => {
    const { workerUser, isLocationEnabled } = useSelector((state) => state.auth);

    useEffect(() => {
        // Only run for logged-in workers
        if (!workerUser || workerUser.role !== 'worker') return;
        
        if (!isLocationEnabled) {
            // Notify backend that tracking is off
            api.put('/worker/location', { lat: 0, lng: 0, isTracking: false }).catch(err => {
                console.error("Failed to update location off status:", err);
            });
            return;
        }

        let intervalId;
        
        const updateLocation = () => {
            if (!navigator.geolocation) {
                console.warn('Geolocation is not supported by your browser');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        // Ping the backend mapped endpoint, including the isLocationEnabled flag
                        await api.put('/worker/location', {
                            lat: latitude,
                            lng: longitude,
                            isTracking: true // Send the tracking status
                        });
                        console.log(`Location updated: ${latitude}, ${longitude}`);
                    } catch (error) {
                        console.error('Failed to update worker location:', error);
                    }
                },
                (error) => {
                    console.error('Error getting geolocation:', error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        };

        // Update immediately on mount
        updateLocation();

        // Then update every 2 minutes (120000ms)
        intervalId = setInterval(updateLocation, 120000);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [workerUser, isLocationEnabled]);
};

export default useWorkerLocation;
