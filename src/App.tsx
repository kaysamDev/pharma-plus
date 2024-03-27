import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

function App() {

  const mapRef = useRef<HTMLDivElement>(null);

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
          zoom: 18,
          mapId: 'pharma_plus',
        };

        // Setting up Map;
        const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
  
        // The marker, positioned at Current Location
        new Marker({
          map: map,
          position: currentPosition,
          title: 'Current Location'
        });
      }, (error) => {
        console.error("Error getting current location", error)
      });
    };


    initMap();
  }, []);

  return (
    <>
      <div style={{height: '100vh'}} ref={mapRef}>

      </div>
    </>
  );
}

export default App;
