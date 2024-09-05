import { useEffect, useState } from "react";
import { EyeIcon, PenIcon, Trash } from "lucide-react";

// Define the Pharmacy type
export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  email: string;
  website: string;
  Tel: string;
  city: string;
  country: string;
  services: string[];
  lat: number;
  lng: number;
};

// Define the GeoJSON structure
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

// Component
export const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [newPharmacy, setNewPharmacy] = useState<Partial<Pharmacy>>({});

  // Fetch Pharmacies
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
  }, []);

  // Create Pharmacy
  const handleCreate = async () => {
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
      if (!res.ok) {
        throw new Error("Failed to create pharmacy");
      }
      const createdPharmacy: Pharmacy = await res.json();
      setPharmacies((prev) => [...prev, createdPharmacy]);
      setNewPharmacy({});
    } catch (error) {
      console.error("Error creating pharmacy:", error);
    }
  };

  // Update Pharmacy
  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/pharmacy/${id}`, {
        method: "PUT",
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
      if (!res.ok) {
        throw new Error("Failed to update pharmacy");
      }
      const updatedPharmacy: Pharmacy = await res.json();
      setPharmacies((prev) =>
        prev.map((pharmacy) =>
          pharmacy.id === id ? updatedPharmacy : pharmacy
        )
      );
    } catch (error) {
      console.error("Error updating pharmacy:", error);
    }
  };

  // Delete Pharmacy
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/pharmacy/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete pharmacy");
      }
      setPharmacies((prev) => prev.filter((pharmacy) => pharmacy.id !== id));
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
    }
  };

  return (
    <div>
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
          {pharmacies.map((pharmacy, index) => (
            <tr key={index}>
              <td>{pharmacy.name}</td>
              <td>{pharmacy.address}</td>
              <td>{pharmacy.email}</td>
              <td>{pharmacy.website}</td>
              <td>{pharmacy.Tel}</td>
              <td>
                <EyeIcon size={24} className="btn" />
                <PenIcon
                  size={24}
                  onClick={() => handleUpdate(pharmacy.id)}
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

      <div>
        <h2>Add New Pharmacy</h2>
        <input
          type="text"
          placeholder="Name"
          value={newPharmacy.name || ""}
          onChange={(e) =>
            setNewPharmacy({ ...newPharmacy, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          value={newPharmacy.address || ""}
          onChange={(e) =>
            setNewPharmacy({ ...newPharmacy, address: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Email"
          value={newPharmacy.email || ""}
          onChange={(e) =>
            setNewPharmacy({ ...newPharmacy, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Website"
          value={newPharmacy.website || ""}
          onChange={(e) =>
            setNewPharmacy({ ...newPharmacy, website: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone"
          value={newPharmacy.Tel || ""}
          onChange={(e) =>
            setNewPharmacy({ ...newPharmacy, Tel: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Latitude"
          value={newPharmacy.lat || ""}
          onChange={(e) =>
            setNewPharmacy({ ...newPharmacy, lat: Number(e.target.value) })
          }
        />
        <input
          type="text"
          placeholder="Longitude"
          value={newPharmacy.lng || ""}
          onChange={(e) =>
            setNewPharmacy({ ...newPharmacy, lng: Number(e.target.value) })
          }
        />
        <button onClick={handleCreate}>Create Pharmacy</button>
      </div>
    </div>
  );
};
