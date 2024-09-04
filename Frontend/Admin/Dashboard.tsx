import { Link } from "react-router-dom";
import "../src/util/style/dashboard.css";
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  HospitalIcon,
  LayoutDashboardIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../src/util/tokenService";
import { useState } from "react";
import Memoji from "/memoji.png";

type Navigation = {
  title: string;
  icon: any;
  active?: boolean;
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
    icon: <UserIcon />,
    active: false,
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    active: false,
  },
];

const dashboard: Dashboard[] = [
  {
    title: "Users",
    figure: 30,
    theme: {
      bg: "#c94277",
      color: "#F3EFF5",
    },
  },
  {
    title: "Pharmacies",
    figure: 30,
    theme: {
      bg: "#F3EFF5",
      color: "#242424",
    },
  },
];

export default function Dashboard() {
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
            {dashboard.map((i: Dashboard) => (
              <div
                className="dashboardCard"
                style={{
                  backgroundColor: `${i.theme.bg}`,
                  color: `${i.theme.color}`,
                }}
              >
                <p>{i.title}</p>
                <div className="figure">
                  <h2>{i.figure}</h2>
                </div>
              </div>
            ))}
          </div>
        );
      case "Pharmacies":
        return <Pharmacies />;
      case "Users":
        return <Users />;
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  };

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
                  fontWeight: i.active? "600": "400"
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
              <LogOutIcon />
            </button>
          </div>
        </div>
        {renderMainSection()}
      </main>
    </div>
  );
}

export const Pharmacies = () => {
  return (
    <div>
      <h1>Pharmacies</h1>
    </div>
  );
};

export const Users = () => {
  return (
    <div>
      <h1>Users</h1>
    </div>
  );
};

export const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
    </div>
  );
};
