import React from "react";
import { selectedPharmacy } from "../..";

interface PharmacyDetailProps {
  selectedPharmacy: selectedPharmacy;
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