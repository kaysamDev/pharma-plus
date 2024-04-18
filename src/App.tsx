import "./App.css";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import geoData from "../data.json";
import Pharmacy from "../src/pharmacy_plus.png";
import { ChevronDownCircle, HospitalIcon, LinkIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

// const pharmaImg =

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [pharma, setPharma] = useState("SELECT PHARMACY");

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
                onChange={(e) => setPharma(e.target.value)}
              >
                <option value="">SELECT PHARMACY</option>
                {data.map((i) => (
                  <option value={i.name} key={i.email}>
                    {i.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </form>
          </div>
        </div>
        {/* Profile and select box for hospital */}

        {/* Selected Pharmacy information*/}
        {pharma &&
          data.map((item) => {
            if (item.name == pharma) {
              return (
                <div className="hosp-container">
                  <div className="hosp-info">
                    <div>
                      <HospitalIcon color="#c94277"/>
                    </div>
                    <div>
                      <p>{item.name}</p>
                    </div>
                  </div>

                  <div className="hosp-info">
                    <MapPinIcon color="#c94277"/>
                    <p>{item.address}</p>
                  </div>

                  <div className="hosp-info">
                    <MailIcon color="#c94277"/>
                    <p>{item.email}</p>
                  </div>

                  <div className="hosp-info">
                    <LinkIcon color="#c94277"/>
                    <p>{item.website}</p>
                  </div>

                  <div className="hosp-info">
                    <PhoneIcon color="#c94277"/>
                    <p>{item.Tel}</p>
                  </div>
                </div>
              );
            }
          })}
        {/* Selected Pharmacy information*/}
      </div>
    </>
  );
}

export default App;
