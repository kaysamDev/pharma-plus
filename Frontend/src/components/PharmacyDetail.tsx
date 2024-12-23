import React from "react";
import { HospitalIcon, LinkIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

// ts

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
  selectedPharmacy: PharmacyData
}

const PharmacyDetail:React.FC<PharmacyDetailProps> = ({selectedPharmacy}) => {
  return (
    <>
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
            <p>{selectedPharmacy.website ? selectedPharmacy.website : "N/A"}</p>
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
    </>
  );
}

export default PharmacyDetail;