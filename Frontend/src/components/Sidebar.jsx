import { useState } from "react";
import {
  FaBars,
  FaBox,
  FaHome,
  FaNewspaper,
  FaSignOutAlt,
  FaUsers,
  FaUserFriends,
  FaTruck,
  FaUserShield,
  FaIdCard,
  
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
import ConfirmWrapper from "./ConfirmWrapper";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const baseMenuItems = [
    { path: "/admin-dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/owner-dashboard", icon: <FaUsers />, label: "Vehicle Owner" },
    { path: "/customer-dashboard", icon: <FaUserFriends />, label: "Customer Management" },
    { path: "/driver-dashboard", icon: <FaIdCard />, label: "Driver Management" },
    /*{ path: "/product-management", icon: <FaBox />, label: "Product" },
    { path: "/publication", icon: <FaNewspaper />, label: "Publication" },*/
    {path:"/vehicle-dashboard", icon:<FaTruck />, label:"Vehicle Management" },
    {path:"/trip-dashboard", icon:<FaBox />, label:"Trip Management" },
    {path:"/bill-dashboard", icon:<FaBox />, label:"Bill Management" },
     /* { path: "/vehicle-dashboard", icon: <FaTruck />, label: "Vehicle Management" },
    { path: "/trip-management", icon: <FaBox />, label: "Trip Management" },*/
  ];

  if (role === "SuperAdmin") {
    baseMenuItems.push({
      path: "/admin-role-dashboard",
      icon: <FaUserShield />,
      label: "Admin Roles",
    });
  }

  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`bg-gradient-to-r from-indigo-800 to-violet-800 text-white transition-all duration-300 ${
          isExpanded ? "w-64" : "w-20"
        } fixed md:relative top-0 left-0 h-full z-50 flex flex-col hidden md:flex`}
      >
        {/* Toggle Button */}
        <button
          className="text-white p-4 focus:outline-none hover:bg-violet-900 transition md:flex items-center justify-center"
          onClick={toggleSidebar}
        >
          {isExpanded ? <FaBars size={28} /> : <FaBars size={28} />}
        </button>

        {/* Menu Items */}
        <ul className="mt-4 space-y-4 flex-grow">
          {baseMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 transition rounded-lg ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg text-white font-bold scale-105"
                      : "hover:bg-violet-900"
                  }`}
                >
                  <span className={`ml-4 mr-3 ${isActive ? "text-3xl" : "text-2xl"}`}>
                    {item.icon}
                  </span>
                  <span
                    className={`transition-all duration-300 text-sm font-medium ${
                      isExpanded ? "opacity-100" : "opacity-0 hidden"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <ConfirmWrapper
          onConfirm={handleLogout}
          message={"Are you sure you want to logout?"}
        >
          <button className="flex items-center p-3 mt-auto hover:bg-red-600 transition rounded-lg text-white w-full text-left">
            <span className="text-2xl ml-4 mr-3">
              <FaSignOutAlt />
            </span>
            <span
              className={`transition-all duration-300 text-sm font-medium ${
                isExpanded ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </ConfirmWrapper>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bg-purple-700 text-white fixed bottom-0 left-0 w-full flex justify-around p-2 md:hidden z-50">
        {baseMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center text-white"
          >
            <span className="text-2xl">{item.icon}</span>
          </Link>
        ))}

        {/* Mobile Logout */}
        <ConfirmWrapper
          onConfirm={handleLogout}
          message={"Are you sure you want to logout?"}
        >
          <button className="flex flex-col items-center text-red-400">
            <span className="text-2xl">
              <FaSignOutAlt />
            </span>
          </button>
        </ConfirmWrapper>
      </div>
    </>
  );
};

export default Sidebar;
