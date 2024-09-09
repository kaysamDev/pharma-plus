import React from "react";
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
interface PharmacyDetailProps {
  selectedPharmacy: PharmacyData;
}

const Services:React.FC<PharmacyDetailProps> = ({ selectedPharmacy }) => {
  return (
    <>
      <div className="hosp-container">
        <h3>Services</h3>
        <div className="hosp-info">
          <ul>
            {selectedPharmacy.services.map((data: string, index: number) => (
              <li key={index}>{data}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Services;