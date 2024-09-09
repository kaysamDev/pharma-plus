import "./App.css";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState, useCallback } from "react";
import Pharmacy from "../src/pharmacy_plus.png";
import { CircleUserIcon, MapPinnedIcon } from "lucide-react";
import PharmacyDetail from "./components/PharmacyDetail";
import Services from "./components/Services";
import ProfileModal from "./components/ProfileModal";

interface PharmacyData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  email?: string;
  website?: string;
  Tel: string;
  city: string;
  country: string;
  services: string[];
}

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [pharma, setPharma] = useState<string>("SELECT PHARMACY");
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyData | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [geoData, setGeoData] = useState<PharmacyData[]>([]);

  // Toggle profile view
  const handleProfileView = () => {
    setShowProfile(!showProfile);
  };

  // Fetch pharmacies
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/pharmacy");

        if (!res.ok) {
          throw new Error("Failed to get Pharmacies");
        }

        const pharmacies = await res.json();
        setGeoData(pharmacies);
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
      }
    };

    fetchPharmacies();
  }, []);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const calculateAndDisplayRoute = useCallback(
    (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) => {
      if (directionsRenderer) {
        const directionsService = new google.maps.DirectionsService();
        const request: google.maps.DirectionsRequest = {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Directions request failed due to " + status);
          }
        });
      }
    },
    [directionsRenderer]
  );

  const calculateDistanceMatrix = useCallback(
    (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) => {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response) {
            const result = response.rows[0].elements[0];
            setDistance(result.distance?.text || null);
            setDuration(result.duration?.text || null);
          } else {
            console.error("Distance Matrix request failed due to " + status);
          }
        }
      );
    },
    []
  );

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = await loader.importLibrary("marker");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(currentPosition);

          const mapOptions: google.maps.MapOptions = {
            center: currentPosition,
            zoom: 14,
            mapId: "pharma_plus",
          };

          const icon: google.maps.Icon = {
            url: Pharmacy,
            scaledSize: new google.maps.Size(30, 30),
          };

          const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

          new Marker({
            map: map,
            position: currentPosition,
            title: "Current Location",
          });

          // Add pharmacy data as GeoJSON to the map
          geoData.forEach((pharmacy) => {
            const pharmacyFeature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [pharmacy.lng, pharmacy.lat],
              },
              properties: pharmacy,
            };

            map.data.addGeoJson(pharmacyFeature);
          });

          map.data.setStyle(() => {
            return {
              icon: icon,
            };
          });

          const directionsRendererInstance = new google.maps.DirectionsRenderer();
          directionsRendererInstance.setMap(map);
          setDirectionsRenderer(directionsRendererInstance);

          map.data.addListener("click", (event: google.maps.Data.MouseEvent) => {
            const clickedPharmacyName = event.feature.getProperty("name") as string;
            const clickedPharmacy = geoData.find((pharmacy) => pharmacy.name === clickedPharmacyName);
            setSelectedPharmacy(clickedPharmacy || null);
            setPharma(clickedPharmacyName);

            if (currentPosition && clickedPharmacy) {
              const destination = { lat: clickedPharmacy.lat, lng: clickedPharmacy.lng };
              calculateAndDisplayRoute(currentPosition, destination);
              calculateDistanceMatrix(currentPosition, destination);
            }
          });
        },
        (error) => {
          console.error("Error getting current location", error);
        }
      );
    };

    if (geoData.length > 0) {
      initMap();
    }
  }, [apiKey, geoData]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPharmacy = geoData.find((pharmacy) => pharmacy.name === e.target.value);
    setPharma(e.target.value);
    setSelectedPharmacy(selectedPharmacy || null);

    if (selectedPharmacy && directionsRenderer && currentPosition) {
      const destination = { lat: selectedPharmacy.lat, lng: selectedPharmacy.lng };
      calculateAndDisplayRoute(currentPosition, destination);
      calculateDistanceMatrix(currentPosition, destination);
    }
  };

  return (
    <>
      <div
        style={{ height: "100vh", width: "100vw", position: "relative" }}
        ref={mapRef}
      ></div>
      <div className="card">
        <div className="prf">
          <div className="profile-img-container" onClick={handleProfileView}>
            {!showProfile && (
              <div>
                <CircleUserIcon size="30px" />
              </div>
            )}
          </div>
          <div>
            <form action="" method="get">
              <select value={pharma} onChange={handleSelectChange}>
                <option value="">SELECT PHARMACY</option>
                {geoData.map((pharmacy) => (
                  <option value={pharmacy.name} key={pharmacy.id}>
                    {pharmacy.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </form>
          </div>
        </div>

        {selectedPharmacy && selectedPharmacy.name === pharma ? (
          <>
            <PharmacyDetail selectedPharmacy={selectedPharmacy} />
            <Services selectedPharmacy={selectedPharmacy} />
            {distance && duration && (
              <div className="distance-info">
                <p>Distance: {distance}</p>
                <p>Duration: {duration}</p>
              </div>
            )}
          </>
        ) : (
          <div className="map-pinned">
            <MapPinnedIcon color="#c94277" size={100} />
          </div>
        )}
      </div>
      <ProfileModal show={showProfile} onClose={handleProfileView} />
    </>
  );
}

export default App;
