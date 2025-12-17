import {
  FaArrowLeft,
  FaBars,
  FaEdit,
  FaHome,
  FaRoute,
  FaCreditCard,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfirmWrapper from "../../components/ConfirmWrapper";

const Sidebar = ({ customer, activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => logout();

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { key: "trips", label: "Trips", icon: <FaRoute /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-indigo-700 
        flex items-center px-4 z-50">
        <button onClick={() => setMobileOpen(true)} className="text-white text-xl">
          <FaBars />
        </button>
        <h1 className="ml-4 text-white font-semibold">Customer Dashboard</h1>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 max-h-screen z-50
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "left-0" : "-left-full lg:left-0"}
          bg-gradient-to-l from-indigo-700 to-violet-800
          text-white transition-all duration-300 flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          {!collapsed && <h2 className="font-bold">Customer</h2>}
          <button
            onClick={() =>
              window.innerWidth < 1024
                ? setMobileOpen(false)
                : setCollapsed(!collapsed)
            }
          >
            {collapsed ? <FaBars /> : <FaArrowLeft />}
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center gap-2 p-4">
          <div className="w-16 h-16 rounded-full bg-white text-indigo-700
            flex items-center justify-center text-2xl font-bold">
            {customer.name?.charAt(0)?.toUpperCase()}
          </div>

          {!collapsed && (
            <>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{customer.name}</span>
                <FaEdit className="cursor-pointer hover:text-yellow-300" />
              </div>
              <span className="text-xs opacity-80">{customer.email}</span>
            </>
          )}
        </div>

        {/* Tabs */}
        <nav className="flex-1 px-2 space-y-1">
          {menu.map(item => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setMobileOpen(false);
              }}
              className={`
                flex items-center gap-3 px-3 py-2 w-full rounded-lg transition
                ${activeTab === item.key
                  ? "bg-white/20"
                  : "hover:bg-white/10"}
              `}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <ConfirmWrapper
          onConfirm={handleLogout}
          message="Are you sure you want to logout?"
        >
          <button className="flex items-center gap-3 p-4 hover:text-red-500">
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </ConfirmWrapper>
      </aside>
    </>
  );
};

export default Sidebar;
