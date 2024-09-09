import React, { useEffect, useState } from "react";
import { CircleXIcon, ImageIcon } from "lucide-react";
import { getToken, removeToken } from "../util/tokenService";
import { useNavigate } from "react-router-dom";

interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  profilePicture: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ show, onClose }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  useEffect(() => {
    if (show) {
      const fetchUserProfile = async () => {
        const token = getToken();
        if (token) {
          try {
            const response = await fetch(
              "http://localhost:5000/api/v1/profile",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch user profile.");
            }

            const data = await response.json();
            setUserProfile({
              name: data.name,
              email: data.email,
              profilePicture:
                data.profile_url ||
                "https://example.com/default-profile-image.jpg",
            });
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      };

      fetchUserProfile();
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>User Profile</h2>
          <button onClick={onClose} className="modal-close">
            <CircleXIcon size={30} />
          </button>
        </div>
        <div>
          {userProfile ? (
            <div className="modal-body">
              {/* <div className="modal-img"> */}
                {/* <img src="/memoji.png" alt="User Profile" /> */}
                <ImageIcon size={60}/>
              {/* <div className="modal-img-overlay">
                <p>Change Profile Picture</p>
              </div> */}
              {/* </div> */}
              <div>
                <p className="txt">Name: <span>{ userProfile.name}</span></p>
                <p className="txt">Email: <span>{ userProfile.email}</span></p>
              </div>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}
        </div>
        <div className="modal-footer">
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
