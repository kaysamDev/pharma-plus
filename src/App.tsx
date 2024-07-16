import "./App.css";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import geoData from "../data.json";
import Pharmacy from "../src/pharmacy_plus.png";
import {
  ChevronDownCircle,
  HospitalIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import { selectedPharmacy } from ".././index";

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [pharma, setPharma] = useState<string>("SELECT PHARMACY");
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<selectedPharmacy | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  const data = geoData.features.map((item) => item.properties);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const calculateAndDisplayRoute = (
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral
  ) => {
    if (directionsRenderer) {
      const directionsService = new google.maps.DirectionsService();
      const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed due to " + status);
        }
      });
    }
  };

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

          const mapOptions = {
            center: currentPosition,
            zoom: 14,
            mapId: "pharma_plus",
          };

          const icon = {
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

          const directionsRendererInstance =
            new google.maps.DirectionsRenderer();
          directionsRendererInstance.setMap(map);
          setDirectionsRenderer(directionsRendererInstance);

          map.data.addListener("click", (event: any) => {
            const clickedPharmacyName = event.feature.getProperty("name");
            const clickedPharmacy: any = data.find(
              (pharmacy: any) => pharmacy.name === clickedPharmacyName
            );
            setSelectedPharmacy(clickedPharmacy);
            setPharma(clickedPharmacyName);

            if (currentPosition) {
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
  }, [apiKey]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPharmacy = data.find(
      (pharmacy) => pharmacy.name === e.target.value
    );
    setPharma(e.target.value);
    setSelectedPharmacy(selectedPharmacy);

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

        {selectedPharmacy && selectedPharmacy.name === pharma && (
          <div className="hosp-container">
            <div className="hosp-info">
              <div>
                <HospitalIcon color="#c94277" />
              </div>
              <div>
                <p>{selectedPharmacy.name}</p>
              </div>
            </div>

            <div className="hosp-info">
              <div>
                <MapPinIcon color="#c94277" />
              </div>
              <div>
                <p>{selectedPharmacy.address}</p>
              </div>
            </div>

            <div className="hosp-info">
              <div>
                <MailIcon color="#c94277" />
              </div>
              <div>
                <p>{selectedPharmacy.email ? selectedPharmacy.email : "N/A"}</p>
              </div>
            </div>

            <div className="hosp-info">
              <div>
                <LinkIcon color="#c94277" />
              </div>
              <div>
                <p>
                  {selectedPharmacy.website ? selectedPharmacy.website : "N/A"}
                </p>
              </div>
            </div>

            <div className="hosp-info">
              <div>
                <PhoneIcon color="#c94277" />
              </div>
              <div>
                <p>{selectedPharmacy.Tel}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
