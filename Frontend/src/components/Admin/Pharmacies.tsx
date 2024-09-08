import { useEffect, useState } from "react";
import { EyeIcon, PenIcon, Trash } from "lucide-react";
import { PharmacyForm } from "./PharmacyForm";
import {PharmacyDetail} from "../Admin/PharmacyDetail"
import { selectedPharmacy as Pharmacy } from "../../..";

type GeoJSONFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    id: string;
    name: string;
    address: string;
    email?: string;
    website?: string;
    Tel: string;
    city: string;
    country: string;
    services: string[];
  };
};

export const Pharmacies = ({
  pharmacies,
  setPharmacies,
}: {
  pharmacies: Pharmacy[];
  setPharmacies: React.Dispatch<React.SetStateAction<Pharmacy[]>>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singlePharmModal, setSinglePharmModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<Partial<Pharmacy> | null>(null);

  // Toggle modal
  const openModal = (pharmacy: Partial<Pharmacy> | null = null) => {
    setSelectedPharmacy(pharmacy);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPharmacy(null);
    setSinglePharmModal(false)
  };

  const openDetailModal = (
    pharmacy: Partial<Pharmacy> | null = null
  ) => {
    setSinglePharmModal(true);
    setSelectedPharmacy(pharmacy);
  };

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/pharmacy");
        if (!res.ok) {
          throw new Error("Failed to fetch pharmacies");
        }
        const data: { features: GeoJSONFeature[] }[] = await res.json();

        const formattedPharmacies: Pharmacy[] = data.flatMap((item) =>
          item.features.map((feature) => ({
            id: feature.properties.id,
            name: feature.properties.name,
            address: feature.properties.address,
            email: feature.properties.email || "N/A",
            website: feature.properties.website || "N/A",
            Tel: feature.properties.Tel,
            city: feature.properties.city,
            country: feature.properties.country,
            services: feature.properties.services,
            lat: feature.geometry.coordinates[1], // Latitude
            lng: feature.geometry.coordinates[0], // Longitude
          }))
        );

        setPharmacies(formattedPharmacies);
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
      }
    };
    fetchPharmacies();
  }, [setPharmacies]);

  // Handle form submission (for both create and edit)
  const handleFormSubmit = async (pharmacy: Partial<Pharmacy>) => {
    if (pharmacy.id) {
      await handleUpdate(pharmacy.id, pharmacy);
    } else {
      await handleCreate(pharmacy);
    }
  };

  // Create Pharmacy
  const handleCreate = async (newPharmacy: Partial<Pharmacy>) => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [newPharmacy.lng, newPharmacy.lat],
          },
          properties: {
            ...newPharmacy,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to create pharmacy");

      const createdPharmacy: Pharmacy = await res.json();
      setPharmacies((prev: Pharmacy[]) => [...prev, createdPharmacy]);
    } catch (error) {
      console.error("Error creating pharmacy:", error);
    }
  };

  // Update Pharmacy
  const handleUpdate = async (id: string, updatedData: Partial<Pharmacy>) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/pharmacy/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [updatedData.lng, updatedData.lat],
          },
          properties: {
            ...updatedData,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to update pharmacy");

      const updatedPharmacy: Pharmacy = await res.json();
      setPharmacies((prev: Pharmacy[]) =>
        prev.map((pharmacy) =>
          pharmacy.id === id ? updatedPharmacy : pharmacy
        )
      );
    } catch (error) {
      console.error("Error updating pharmacy:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/pharmacy/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete pharmacy");
      }
      setPharmacies((prev: Pharmacy[]) =>
        prev.filter((pharmacy: Pharmacy) => pharmacy.id !== id)
      );
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
    }
  };

  return (
    <div>
      <button className="add-pharm" onClick={() => openModal()}>
        Add Pharmacy
      </button>
      <table className="pharmacy-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Website</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pharmacies.map((pharmacy: Pharmacy, index: number) => (
            <tr key={index}>
              <td>{pharmacy.name}</td>
              <td>{pharmacy.address}</td>
              <td>{pharmacy.email}</td>
              <td>{pharmacy.website}</td>
              <td>{pharmacy.Tel}</td>
              <td>
                <EyeIcon size={24} className="btn" onClick={()=> openDetailModal(pharmacy)}/>
                <PenIcon
                  size={24}
                  onClick={() => openModal(pharmacy)}
                  className="btn"
                />
                <Trash
                  size={24}
                  onClick={() => handleDelete(pharmacy.id)}
                  className="btn"
                  color="red"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <PharmacyForm
          pharmacy={selectedPharmacy || {}}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
        />
      )}

      {singlePharmModal && (
        <PharmacyDetail
          pharmacy={selectedPharmacy || {}}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
