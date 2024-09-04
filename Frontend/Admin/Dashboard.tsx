import { Link } from "react-router-dom";
import "../src/util/style/dashboard.css";
import {
  UserCircleIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  HospitalIcon,
  LayoutDashboardIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../src/util/tokenService";

type Navigation = {
  title: string;
  icon: any;
};

type Dashboard = {
  title: string;
  figure: number;
  theme: {
    bg: string;
    color: string;
  };
};

const navigations: Navigation[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Pharmacies",
    icon: <HospitalIcon />,
  },
  {
    title: "Users",
    icon: <UserIcon />,
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
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

  const handleLogout = () => {
    removeToken();
    navigate("/login");
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
            <UserCircleIcon size={60} />
            <p>Admin name</p>
          </div>
        </div>
        <div>
          <div className="nav-btn">
            {navigations.map((i: Navigation) => (
              <button>
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
          <h2>Dashboard</h2>
          <div>
            <button className="home-btn" onClick={()=> navigate('/')}>Home</button>
            <button onClick={handleLogout}>
              <LogOutIcon />
            </button>
          </div>
        </div>
        <div className="main-section">
          {dashboard.map((i:Dashboard) => (
            <div className="dashboardCard" style={{backgroundColor: `${i.theme.bg}`, color: `${i.theme.color}`}}>
              <p>{i.title}</p>
              <div className="figure">
                <h2>{i.figure}</h2>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
