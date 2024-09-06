import { Link } from "react-router-dom";
import "../src/util/style/dashboard.css";
import {
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  HospitalIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../src/util/tokenService";
import { ReactNode, useEffect, useState } from "react";
import Memoji from "/memoji.png";
import { User } from "..";
import { Users } from "../src/components/Admin/Users";
import { Pharmacies } from "../src/components/Admin/Pharmacies";


type Navigation = {
  title: string;
  icon: ReactNode;
  active?: boolean;
};

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

type Dashboard = {
  title: string;
  figure: number;
  theme: {
    bg: string;
    color: string;
  };
};

const initialNavigations: Navigation[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboardIcon />,
    active: true, // Default active item
  },
  {
    title: "Pharmacies",
    icon: <HospitalIcon />,
    active: false,
  },
  {
    title: "Users",
    icon: <UsersIcon />,
    active: false,
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    active: false,
  },
];

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const navigate = useNavigate();
  const [navigations, setNavigations] =
    useState<Navigation[]>(initialNavigations);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const handleNavigationClick = (title: string) => {
    const updatedNavigations = navigations.map((nav) =>
      nav.title === title ? { ...nav, active: true } : { ...nav, active: false }
    );
    setNavigations(updatedNavigations);
  };

  const renderMainSection = () => {
    const activeNav = navigations.find((nav) => nav.active)?.title;
    switch (activeNav) {
      case "Dashboard":
        return (
          <div className="main-section">
              <div
                className="dashboardCard"
                style={{
                  backgroundColor: "#c94277",
                  color: "#F3EFF5",
                }}
              >
                <p>Users</p>
                <div className="figure">{<h2>{users.length}</h2>}</div>
              </div>
              <div
                className="dashboardCard"
                style={{
                  backgroundColor: "#F3EFF5",
                  color: "#242424",
                }}
              >
                <p>Pharmacies</p>
                <div className="figure">{<h2>{pharmacies.length}</h2>}</div>
              </div>
          </div>
        );
      case "Pharmacies":
        return <Pharmacies pharmacies={pharmacies} setPharmacies={setPharmacies}/>;
      case "Users":
        return <Users users={users} />;
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  };

  // get user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/users");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setUsers(data); // Set the fetched user data
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [setUsers]);

  return (
    <div className="dashboard">
      {/* Side nav */}
      <aside className="side-nav">
        <div>
          <Link to="/">
            <h2 className="logo">GeoPharmacy</h2>
          </Link>

          <div className="user-img">
            <div>
              <img src={Memoji} alt="admin image" />
            </div>
            <p>Admin name</p>
          </div>
        </div>
        <div>
          <div className="nav-btn">
            {navigations.map((i: Navigation) => (
              <button
                key={i.title}
                onClick={() => handleNavigationClick(i.title)}
                style={{
                  backgroundColor: i.active ? "#e0e0e0" : "transparent",
                  color: i.active ? "#333" : "#000",
                  fontWeight: i.active ? "600" : "400",
                }}
              >
                <div>{i.icon}</div>
                {i.title}
              </button>
            ))}
          </div>
        </div>
      </aside>
      {/* Main section */}
      <main>
        <div className="top-nav">
          <h2>{navigations.find((nav) => nav.active)?.title}</h2>
          <div>
            <button className="home-btn" onClick={() => navigate("/")}>
              Home
            </button>
            <button onClick={handleLogout}>
              <LogOutIcon size="16px" />
            </button>
          </div>
        </div>
        {renderMainSection()}
      </main>
    </div>
  );
}

export const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
    </div>
  );
};
