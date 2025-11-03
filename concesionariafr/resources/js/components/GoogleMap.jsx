import React, { useEffect, useRef, useState } from 'react';
import { MdMyLocation, MdDirectionsCar, MdDirectionsWalk, MdDirectionsBike, MdDirectionsTransit } from 'react-icons/md';

/**
 * Componente GoogleMap
 * - Carga dinámica de la Google Maps JS API usando VITE_GOOGLE_MAPS_API_KEY
 * - Muestra un mapa centrado en {lat, lng} con marcador
 * - Reutilizable en cualquier página
 */
const GoogleMap = ({
    lat,
    lng,
    zoom = 14,
    markerTitle = 'Concesionario',
    className = '',
    height = '320px',
    mapId,
    enableDirections = true,
    country = 'ar', // restringir por país (opcional)
    biasRadiusMeters = 50000, // 50 km por defecto
    strictLocalBias = true, // forzar a priorizar solo resultados dentro del radio
}) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [loadError, setLoadError] = useState('');
    const [originText, setOriginText] = useState('');
    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);
    const directionsServiceRef = useRef(null);
    const directionsRendererRef = useRef(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [mode, setMode] = useState('DRIVING');
    const lastOriginRef = useRef(null);

    // Utilidad simple de debounce
    const debounceRef = useRef(null);
    const debounce = (fn, delay = 500) => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(fn, delay);
    };

    // Cargar script de Google Maps si no existe
    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            setLoadError('Falta VITE_GOOGLE_MAPS_API_KEY en .env');
            return;
        }

        const scriptId = 'google-maps-js';
        const existing = document.getElementById(scriptId);

        const initMap = () => {
            if (!window.google || !window.google.maps || !mapRef.current) return;
            const center = { lat: Number(lat), lng: Number(lng) };

            if (!mapInstanceRef.current) {
                mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    mapId,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                });
            } else {
                mapInstanceRef.current.setCenter(center);
                mapInstanceRef.current.setZoom(zoom);
            }

            if (!markerRef.current) {
                markerRef.current = new window.google.maps.Marker({
                    position: center,
                    map: mapInstanceRef.current,
                    title: markerTitle,
                });
            } else {
                markerRef.current.setPosition(center);
                markerRef.current.setTitle(markerTitle || 'Concesionario');
            }

            if (enableDirections) {
                if (!directionsServiceRef.current) {
                    directionsServiceRef.current = new window.google.maps.DirectionsService();
                }
                if (!directionsRendererRef.current) {
                    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({ suppressMarkers: false });
                    directionsRendererRef.current.setMap(mapInstanceRef.current);
                }
            }

            if (enableDirections && window.google.maps.places && inputRef.current && !autocompleteRef.current) {
                const token = new window.google.maps.places.AutocompleteSessionToken();
                // Definir bounds alrededor del destino para sesgar resultados
                const center = new window.google.maps.LatLng(Number(lat), Number(lng));
                const circle = new window.google.maps.Circle({ center, radius: Number(biasRadiusMeters) });
                const bounds = circle.getBounds();

                autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                    fields: ['place_id', 'geometry', 'formatted_address', 'name'],
                    componentRestrictions: country ? { country } : undefined,
                    // "address" prioriza direcciones exactas sobre resultados genéricos
                    types: ['address'],
                });
                autocompleteRef.current.setOptions({ sessionToken: token });
                if (bounds) {
                    autocompleteRef.current.setBounds(bounds);
                    autocompleteRef.current.setOptions({
                        strictBounds: !!strictLocalBias,
                        // Nuevas opciones de sesgo/restricción (cuando están disponibles en la lib)
                        locationBias: bounds,
                        locationRestriction: !!strictLocalBias ? bounds : undefined,
                    });
                }
                autocompleteRef.current.addListener('place_changed', () => {
                    const place = autocompleteRef.current.getPlace();
                    if (!place || !place.geometry || !place.geometry.location) return;
                    const loc = place.geometry.location;
                    const addr = place.formatted_address || place.name || '';
                    setOriginText(addr);
                    calculateRoute({ lat: loc.lat(), lng: loc.lng() });
                });
            }
        };

        if (existing) {
            if (window.google && window.google.maps) {
                initMap();
            } else {
                existing.addEventListener('load', initMap, { once: true });
            }
            if (enableDirections && (!window.google || !window.google.maps || !window.google.maps.places)) {
                const extra = document.createElement('script');
                extra.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                extra.async = true;
                extra.defer = true;
                extra.onload = initMap;
                document.body.appendChild(extra);
            }
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onerror = () => setLoadError('No se pudo cargar Google Maps');
        script.onload = initMap;
        document.body.appendChild(script);

        return () => {
            // No removemos el script para reutilización global; solo limpiamos listeners
            script.onload = null;
        };
    }, [lat, lng, zoom, markerTitle, mapId, enableDirections]);

    const calculateRoute = (origin) => {
        if (!enableDirections || !directionsServiceRef.current || !window.google) return;
        const destination = new window.google.maps.LatLng(Number(lat), Number(lng));
        const request = {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode[mode],
        };
        directionsServiceRef.current.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRendererRef.current.setDirections(result);
                const leg = result.routes?.[0]?.legs?.[0];
                if (leg) {
                    setRouteInfo({
                        distanceText: leg.distance?.text,
                        durationText: leg.duration?.text,
                        originAddress: leg.start_address,
                        destinationAddress: leg.end_address,
                    });
                    lastOriginRef.current = leg.start_location;
                }
            } else {
                setRouteInfo(null);
            }
        });
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const o = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setOriginText('Mi ubicación');
                calculateRoute(o);
            },
            () => {
                // silencio
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    // Recalcular al cambiar el modo
    useEffect(() => {
        if (!enableDirections) return;
        if (lastOriginRef.current) {
            const o = { lat: lastOriginRef.current.lat(), lng: lastOriginRef.current.lng() };
            calculateRoute(o);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // Geocodificar automáticamente cuando el usuario tipeó texto (fallback si no elige sugerencia)
    useEffect(() => {
        if (!enableDirections) return;
        if (!originText || originText.trim().length < 4) return;
        if (!window.google || !window.google.maps || !window.google.maps.Geocoder) return;

        debounce(() => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: originText }, (results, status) => {
                if (status === 'OK' && results?.[0]?.geometry?.location) {
                    const loc = results[0].geometry.location;
                    calculateRoute({ lat: loc.lat(), lng: loc.lng() });
                }
            });
        }, 700);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originText]);

    return (
        <div className={className}>
            {loadError ? (
                <div className="text-sm text-red-600">{loadError}</div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {enableDirections && (
                        <div className="absolute z-10 left-2 right-2 top-2 flex flex-col gap-2 md:flex-row md:items-center">
                            <input
                                ref={inputRef}
                                value={originText}
                                onChange={(e) => setOriginText(e.target.value)}
                                placeholder="Ingresá tu ubicación"
                                className="w-full md:w-auto flex-1 bg-white rounded px-3 py-2 shadow border"
                            />
                            <div className="flex gap-2 items-center">
                                <button
                                    type="button"
                                    onClick={handleUseMyLocation}
                                    className="rounded p-2 border border-gray-300 bg-white/90 hover:bg-white text-black"
                                    title="Usar mi ubicación"
                                >
                                    <MdMyLocation size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('DRIVING')}
                                    className={`rounded p-2 border border-gray-300 bg-white/90 hover:bg-white text-black ${mode==='DRIVING'?'ring-2 ring-black':''}`}
                                    title="Auto"
                                >
                                    <MdDirectionsCar size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('WALKING')}
                                    className={`rounded p-2 border border-gray-300 bg-white/90 hover:bg-white text-black ${mode==='WALKING'?'ring-2 ring-black':''}`}
                                    title="Caminando"
                                >
                                    <MdDirectionsWalk size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('BICYCLING')}
                                    className={`rounded p-2 border border-gray-300 bg-white/90 hover:bg-white text-black ${mode==='BICYCLING'?'ring-2 ring-black':''}`}
                                    title="Bicicleta"
                                >
                                    <MdDirectionsBike size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('TRANSIT')}
                                    className={`rounded p-2 border border-gray-300 bg-white/90 hover:bg-white text-black ${mode==='TRANSIT'?'ring-2 ring-black':''}`}
                                    title="Transporte público"
                                >
                                    <MdDirectionsTransit size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                    <div
                        ref={mapRef}
                        style={{ width: '100%', height }}
                        aria-label="Mapa de Google"
                    />
                    {enableDirections && routeInfo && (
                        <div className="absolute z-10 left-2 bottom-2 bg-white rounded shadow px-3 py-2 text-sm">
                            <div><strong>Distancia:</strong> {routeInfo.distanceText || '-'} </div>
                            <div><strong>Tiempo:</strong> {routeInfo.durationText || '-'} </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GoogleMap;


