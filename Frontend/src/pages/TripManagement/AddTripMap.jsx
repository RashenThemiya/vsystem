// src/pages/AddTripMap.jsx
import { useEffect, useRef } from "react";

const TripMap = ({
  trip,
  setTrip,
  fromInputRef,
  toInputRef,
  waypointRefs,
  vehicles,
  calculateTotalEstimatedCost,
  mapRef,
  GOOGLE_MAPS_API_KEY,
}) => {
  const mapInstance = useRef(null);
  const directionsRendererRef = useRef(null);
  const directionsServiceRef = useRef(null);

  /** -------- SAFE GOOGLE SCRIPT LOADER (NO DUPLICATE LOAD) -------- */
  const loadGoogleScript = () => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    if (document.getElementById("google-maps-script")) return;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;

    document.head.appendChild(script);
  };

  useEffect(() => {
    loadGoogleScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** -------- INITIALIZE MAP -------- */
  const initMap = () => {
    if (!mapRef?.current || !window.google) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 7.8731, lng: 80.7718 },
      zoom: 7,
    });

    directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current.setMap(mapInstance.current);

    // Attach form autocompletes
    safeAttachAutocomplete(fromInputRef, (addr) =>
      updateTripField("from_location", addr)
    );
    safeAttachAutocomplete(toInputRef, (addr) =>
      updateTripField("to_location", addr)
    );

    attachAutocompleteToWaypointRefs();

    // MAP CLICK → fill locations
    mapInstance.current.addListener("click", (e) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: e.latLng }, (results, status) => {
        if (status !== "OK" || !results?.[0]) return;
        const address = results[0].formatted_address;

        setTrip((prev) => {
          if (!prev.from_location)
            return { ...prev, from_location: address };
          if (!prev.to_location)
            return { ...prev, to_location: address };
          return {
            ...prev,
            waypoints: [...prev.waypoints, address],
          };
        });

        setTimeout(() => calculateRoute(), 300);
      });
    });
  };

  /** -------- AUTOCOMPLETE SAFE ATTACH HELPER -------- */
  const safeAttachAutocomplete = (refObj, onSelect) => {
    try {
      const el = refObj?.current;
      if (!el || !window.google) return;

      const input =
        el instanceof HTMLInputElement
          ? el
          : el.querySelector("input") || el;

      if (!input) return;

      const auto = new window.google.maps.places.Autocomplete(input);
      auto.addListener("place_changed", () => {
        const p = auto.getPlace();
        const addr = p.formatted_address || p.name;
        if (addr) onSelect(addr);
      });
    } catch (e) {
      console.warn("safeAttachAutocomplete error:", e);
    }
  };

  /** -------- WAYPOINT AUTOCOMPLETE (FIXED) -------- */
  const attachAutocompleteToWaypointRefs = () => {
    if (!window.google || !waypointRefs?.current) return;

    waypointRefs.current.forEach((ref, index) => {
      if (!ref || ref._auto) return;

      const input =
        ref instanceof HTMLInputElement
          ? ref
          : ref.querySelector("input") || ref;

      if (!input) return;

      try {
        const auto = new window.google.maps.places.Autocomplete(input);
        auto.addListener("place_changed", () => {
          const place = auto.getPlace();
          const address = place.formatted_address || place.name;

          if (!address) return;

          setTrip((prev) => {
            const arr = [...prev.waypoints];
            arr[index] = address;
            return { ...prev, waypoints: arr };
          });
        });

        ref._auto = true;
      } catch (err) {
        console.warn("Waypoint autocomplete attach failed", err);
      }
    });
  };

  /** -------- ROUTE CALCULATION -------- */
  const calculateRoute = () => {
    if (!trip.from_location || !trip.to_location) return;

    const waypoints = trip.waypoints.map((wp) => ({
      location: wp,
      stopover: true,
    }));

    const svc = directionsServiceRef.current;
    const rnd = directionsRendererRef.current;
    if (!svc || !rnd) return;

    svc.route(
      {
        origin: trip.from_location,
        destination: trip.to_location,
        travelMode: "DRIVING",
        waypoints,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status !== "OK" || !result) {
          console.error("Route failed:", status);
          return;
        }

        rnd.setDirections(result);

        let totalMeters = 0;
        const legs = result.routes[0].legs || [];
        const mapLocations = [];

        legs.forEach((leg, i) => {
          totalMeters += leg.distance.value;

          if (i === 0)
            mapLocations.push({
              location_name: trip.from_location,
              latitude: leg.start_location.lat(),
              longitude: leg.start_location.lng(),
            });

          mapLocations.push({
            location_name:
              leg.end_address ||
              trip.waypoints[i] ||
              trip.to_location,
            latitude: leg.end_location.lat(),
            longitude: leg.end_location.lng(),
          });
        });

        const km = (totalMeters / 1000).toFixed(2);

        setTrip((prev) => {
          const newTrip = { ...prev };
          newTrip.estimated_distance = km;
          newTrip.map_locations = mapLocations;

          const veh = vehicles.find(
            (v) => Number(v.vehicle_id) === Number(newTrip.vehicle_id)
          );
          newTrip.total_estimated_cost =
            calculateTotalEstimatedCost(newTrip, veh);

          return newTrip;
        });
      }
    );
  };

  /** reattach waypoint autocompletes when count changes */
  useEffect(() => {
    attachAutocompleteToWaypointRefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.waypoints.length]);

  /** recalc route on location changes */
  useEffect(() => {
    if (trip.from_location && trip.to_location) calculateRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.from_location, trip.to_location, trip.waypoints.join("|")]);

  const updateTripField = (f, v) => {
    setTrip((p) => ({ ...p, [f]: v }));
  };

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "550px" }}
      className="rounded-xl border shadow"
    />
  );
};

export default TripMap;
