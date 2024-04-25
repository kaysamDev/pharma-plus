import "./App.css";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import geoData from "../data.json";
import Pharmacy from "../src/pharmacy_plus.png";
import { ChevronDownCircle, HospitalIcon, LinkIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

// const pharmaImg =

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [pharma, setPharma] = useState<string>("SELECT PHARMACY");
  const [selectedPharmacy,  setSelectedPharmacy] = useState<any>(null)

  const data = geoData.features.map((item) => item.properties);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = await loader.importLibrary("marker");

      // Get current Location using Geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const mapOptions = {
            center: currentPosition,
            zoom: 14,
            mapId: "pharma_plus",
          };

          // Custom marker for pharmacies
          const icon = {
            url: Pharmacy,
            scaledSize: new google.maps.Size(30, 30),
          };

          // Setting up Map;
          const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

          // Add click event listener to markers
          map.data.addListener('click', (event: any) => {
            const clickedPharmacyName = event.feature.getProperty("name");
            const clickedPharmacy:any = data.find((pharmacy: any) => pharmacy.name === clickedPharmacyName);
            setSelectedPharmacy(clickedPharmacy);
            setPharma(clickedPharmacyName);
          });

          // The marker, positioned at Current Location
          new Marker({
            map: map,
            position: currentPosition,
            title: "Current Location",
          });

          // Loading GeoJson data
          map.data.addGeoJson(geoData, {
            idPropertyName: "name",
          });

          map.data.setStyle((geoData: any) => {
            geoData = {
              icon: icon
            }
            return geoData;
          });
        },
        (error) => {
          console.error("Error getting current location", error);
        }
      );
    };

    initMap();
  }, []);

  return (
    <>
      <div
        style={{ height: "100vh", width: "100vw", position: "relative" }}
        ref={mapRef}
      ></div>
      <div className="card">
        {/* Profile and select box for hospital */}
        <div className="prf">
          <div className="profile-img-container">
            <img src={Pharmacy} alt="profile image" className="profile-img" />
            <ChevronDownCircle width={20} height={20} color="#c94277" />
          </div>
          <div>
            <form action="" method="get">
              <select
                value={pharma}
                onChange={(e) => {
                  const selectedPharmacy = data.find((pharmacy) => pharmacy.name === e.target.value);
                  setPharma(e.target.value);
                  setSelectedPharmacy(selectedPharmacy);
                }}
              >
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
        {/* Profile and select box for hospital */}

        {/* Selected Pharmacy information*/}
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
                <p>{selectedPharmacy.email? selectedPharmacy.email : 'N/A'}</p>
              </div>
            </div>

            <div className="hosp-info">
              <div>
                <LinkIcon color="#c94277" />
              </div>
              <div>
                <p>{selectedPharmacy.website? selectedPharmacy.website : 'N/A'}</p>
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
        {/* Selected Pharmacy information*/}
      </div>
    </>
  );
}

export default App;
