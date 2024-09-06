import { useState } from "react";
import { selectedPharmacy as Pharmacy } from "../../..";

const servicesList = [
  "In-store shopping",
  "In-store pick-up",
  "Delivery",
  "Prescription dispensing",
  "Medication therapy management",
  "Health screenings",
  "Immunizations",
  "Medication counseling",
  "Chronic disease management",
  "Home delivery services",
  "Over-the-counter medication sales",
  "Wellness and preventive care programs",
  "Health education",
  "Disease prevention",
  "Accessibility services",
];

type PharmacyFormProps = {
  pharmacy?: Partial<Pharmacy>;
  onSubmit: (pharmacy: Partial<Pharmacy>) => void;
  onClose: () => void;
};

export const PharmacyForm = ({
  pharmacy = {},
  onSubmit,
  onClose,
}: PharmacyFormProps) => {
  const [formData, setFormData] = useState<Partial<Pharmacy>>(pharmacy);
  const [step, setStep] = useState<number>(1); // Step 1: Pharmacy details, Step 2: Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSubmit = () => {
    onSubmit({ ...formData, services: selectedServices });
    onClose();
  };

  const handleNext = () => {
    setStep(2); // Move to the service selection step
  };

  return (
    <div className="modal">
      <div className={`modal-content ${step === 2 ? "slide-left" : ""}`}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {step === 1 ? (
          <>
            <h2 className="modal-title">
              {pharmacy.id ? "Edit Pharmacy" : "Add New Pharmacy"}
            </h2>
            <div className="group">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter pharmacy name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  placeholder="Enter website URL"
                  value={formData.website || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  name="lat"
                  placeholder="Enter latitude"
                  value={formData.lat || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lat: Number(e.target.value) })
                  }
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  name="lng"
                  placeholder="Enter longitude"
                  value={formData.lng || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lng: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="group">
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Enter Country Name"
                  value={formData.country || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lat: Number(e.target.value) })
                  }
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter City"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lng: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input
                type="text"
                name="tel"
                placeholder="Enter City"
                value={formData.Tel || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lng: Number(e.target.value) })
                }
              />
            </div>

            <button className="submit-btn" onClick={handleNext}>
              Next
            </button>
          </>
        ) : (
          <>
            <h2 className="modal-title">Select Pharmacy Services</h2>
            <div className="services-list">
              {servicesList.map((service) => (
                <div key={service} className="form-group">
                  <div className="chck-box">
                    <input
                      type="checkbox"
                      id={service}
                      checked={selectedServices.includes(service)}
                      onChange={() => handleServiceChange(service)}
                    />
                    <label htmlFor={service}>{service}</label>
                  </div>
                </div>
              ))}
            </div>
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};
