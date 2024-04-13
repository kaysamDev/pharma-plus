import './App.css'
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import geoData from "../data.json"
import Pharmacy from '../src/pharmacy_plus.png'
import { ChevronDownCircle } from "lucide-react";

// const pharmaImg = 

function App() {

  const mapRef = useRef<HTMLDivElement>(null);
  const [infoWindowContent, setInfoWindowContent] = useState<string | null>(null)
  const [infoWindowPosition, setInfoWindowPosition] = useState<{ lat: number, lng: number} | null>(null)

  const data = geoData.features.map((item)=> item.properties);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary('maps');
      const { Marker } = await loader.importLibrary('marker');

      // Get current Location using Geolocation API
      navigator.geolocation.getCurrentPosition((position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }


        const mapOptions = {
          center: currentPosition,
          zoom: 14,
          mapId: 'pharma_plus',
        };

        // Custom marker for pharmacies
        const icon = {
          url: Pharmacy,
          scaledSize: new google.maps.Size(30, 30)
        }

        // Setting up Map;
        const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
  
        // The marker, positioned at Current Location
        new Marker({
          map: map,
          position: currentPosition,
          title: 'Current Location'
        });

        // Loading GeoJson data
          map.data.addGeoJson(geoData, {
            idPropertyName: 'name'
          });

          map.data.setStyle((geoData: any) => {
            return {
              icon: icon
            };
          });

          // Attaching click event listener to each marker
          map.data.addListener('click', (event:any) => {
            const markerPosition = event.feature.getGeometry().get();
            const markerInfo = event.feature.getProperty('name');
            
            // Set InfoWindow content and position
            setInfoWindowContent(`<div><h3>${markerInfo}</h3><p>${markerInfo.description}</p></div>`);
            setInfoWindowPosition(markerPosition);
          })
        
      }, (error) => {
        console.error("Error getting current location", error)
      });
    };


    initMap();
  }, []);

  return (
    <>
      <div style={{height: '100vh', width: '100vw', position: 'relative'}} ref={mapRef}>
      </div>
      <div className="card">

      {/* Profile and select box for hospital */}
      <div className='prf'>
        <div className='profile-img-container'>
          <img src={Pharmacy} alt="profile image" className="profile-img"/>
          <ChevronDownCircle width={20} height={20} color='#c94277'/>
        </div>
        <div>
          <form action="" method="get">
            <select name="">
              <option value="">SELECT PHARMACY</option>
                {data.map((i)=> (
                  <option value="" key={i.email}>
                    {i.name}
                  </option>
                ))}
            </select>
          </form>
        </div>
      </div>
      {/* Profile and select box for hospital */}

      </div>
      {/* {infoWindowContent && infoWindowPosition && (
        <div style={{ position: 'absolute', top: 50, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
          <div dangerouslySetInnerHTML={{ __html: infoWindowContent }}></div>
        </div>
      )} */}
    </>
  );
}

export default App;