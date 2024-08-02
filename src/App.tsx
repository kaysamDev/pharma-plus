import "./App.css";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState, useCallback } from "react";
import geoData from "../data.json";
import Pharmacy from "../src/pharmacy_plus.png";
import { ChevronDownCircle, MapPinnedIcon } from "lucide-react";
import { selectedPharmacy } from ".././index";
import PharmacyDetail from "./components/PharmacyDetail";
import Services from "./components/Services";

interface GeoDataFeature {
  properties: selectedPharmacy;
}

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [pharma, setPharma] = useState<string>("SELECT PHARMACY");
  const [selectedPharmacy, setSelectedPharmacy] = useState<selectedPharmacy | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null);

  const data = geoData.features.map((item: GeoDataFeature) => item.properties);

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

          map.data.addGeoJson(geoData, {
            idPropertyName: "name",
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
            const clickedPharmacy = data.find((pharmacy) => pharmacy.name === clickedPharmacyName);
            setSelectedPharmacy(clickedPharmacy || null);
            setPharma(clickedPharmacyName);

            if (currentPosition && clickedPharmacy) {
              calculateAndDisplayRoute(currentPosition, {
                lat: clickedPharmacy.lat,
                lng: clickedPharmacy.lng,
              });
            }
          });
        },
        (error) => {
          console.error("Error getting current location", error);
        }
      );
    };

    initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPharmacy = data.find((pharmacy) => pharmacy.name === e.target.value);
    setPharma(e.target.value);
    setSelectedPharmacy(selectedPharmacy || null);

    if (selectedPharmacy && directionsRenderer && currentPosition) {
      calculateAndDisplayRoute(currentPosition, {
        lat: selectedPharmacy.lat,
        lng: selectedPharmacy.lng,
      });
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
          <div className="profile-img-container">
            <img src={Pharmacy} alt="profile image" className="profile-img" />
            <ChevronDownCircle width={20} height={20} color="#c94277" />
          </div>
          <div>
            <form action="" method="get">
              <select value={pharma} onChange={handleSelectChange}>
                <option value="">SELECT PHARMACY</option>
                {data.map((i) => (
                  <option value={i.name} key={i.id}>
                    {i.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </form>
          </div>
        </div>

        {selectedPharmacy && selectedPharmacy.name === pharma ? (
          <>
            <PharmacyDetail selectedPharmacy={selectedPharmacy} />
            <Services selectedPharmacy={selectedPharmacy}/>
          </>
        ) : (
          <div className="map-pinned">
            <MapPinnedIcon color="#c94277" size={100} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
