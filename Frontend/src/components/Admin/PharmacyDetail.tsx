import { selectedPharmacy as Pharmacy } from "../../..";

type PharmacyFormProps = {
  pharmacy?: Partial<Pharmacy>;
  onClose: () => void;
};

export const PharmacyDetail = ({
  pharmacy = {},
  onClose,
}: PharmacyFormProps) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h1>Pharmacy Detail</h1>
        {pharmacy && (
          <div className="modal-detail">
            <p>
              <strong>Name:</strong> {pharmacy.name}
            </p>
            <p>
              <strong>Address:</strong> {pharmacy.address}
            </p>
            <p>
              <strong>Email:</strong> {pharmacy.email || "N/A"}
            </p>
            <p>
              <strong>Website:</strong> {pharmacy.website || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {pharmacy.Tel}
            </p>
            <p>
              <strong>City:</strong> {pharmacy.city}
            </p>
            <p>
              <strong>Country:</strong> {pharmacy.country}
            </p>
            <p>
              <strong>Services:</strong>{" "}
            </p>
              <p>{pharmacy.services?.length ? <div className="srv">{pharmacy.services.join(", ")}</div> : "N/A"}</p>
          </div>
        )}
      </div>
    </div>
  );
};
