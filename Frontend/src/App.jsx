import 'font-awesome/css/font-awesome.min.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";


import Contact from "./pages/Contact";
import Login from "./pages/Login";

import AddProduct from './pages/ProductManagement/AddProduct';
import EditProduct from './pages/ProductManagement/EditProduct';
import ProductManagement from './pages/ProductManagement/ProductManagement';
import ViewProducts from './pages/ProductManagement/ViewProducts';
import AddPublication from './pages/Publications/AddPublication';
import Publication from './pages/Publications/PublicationManagement';
import ViewPublications from './pages/Publications/ViewPublications';
{/*import VehicleOwner from './pages/VehcileOwner/VehcileOwner';
import AddOwner from './pages/VehcileOwner/AddOwner';
import ViewVehicleOwners from './pages/VehcileOwner/ViewVehicleOwners';*/}
//import CustomerManagement from './pages/Customers/CustomerManagement';
//import AddCustomer from './pages/Customers/AddCustomer';
//import ViewCustomers from './pages/Customers/ViewAllCustomers';
//import EditCustomer from './pages/Customers/EditCustomer';
{/*import DriverManagement from './pages/Drivers/DriverManagement';
import AddDriver from './pages/Drivers/AddDriver';
import ViewAllDrivers from './pages/Drivers/ViewAllDrivers';
import EditDriver from './pages/Drivers/EditDriver';*/}
//import AdminRoleManagement from './pages/AdminRoleManagement/AdminRoleManagement';
//import AddAdminRole from './pages/AdminRoleManagement/AddAdminRole';
//import ViewAllAdmins from './pages/AdminRoleManagement/ViewAllAdmins';
{/*import VehicleManagement from './pages/VehicleManagement/VehicleManagement';
import AddVehicle from './pages/VehicleManagement/AddVehicle';
import ViewVehicles from './pages/VehicleManagement/ViewVehicles';
import EditVehicle from './pages/VehicleManagement/EditVehicle';*/}
import TripManagement from './pages/TripManagement/TripManagement';
import AddTrip from './pages/TripManagement/AddTrip';
import CustomerDashboard from './pages/Customers/CustomerDashboard';
import DriverDashboard from './pages/Drivers/DriverDashboard';
import OwnerDashboard from './pages/VehcileOwner/OwnerDashboard';
import VehicleDashboard from './pages/VehicleManagement/VehicleDashboard';
import AdminRoleDashboard from './pages/AdminRoleManagement/AdminDashboard';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
         

            <Route path="/contact" element={<Contact />} />
           

            {/* Protected routes */}
            <Route
              path="/admin-dashboard"
              element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
            />
           
            {/*<Route
              path="/vehicle-owner"
              element={<PrivateRoute><VehicleOwner /></PrivateRoute>}
            />
            <Route path="/add-owner" element={<PrivateRoute><AddOwner /></PrivateRoute>} />
            <Route path="/view-owners" element={<PrivateRoute><ViewVehicleOwners /></PrivateRoute>} />*/}
            <Route path="/owner-dashboard" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />

            {/*customer management routes*/}
            {/*<Route
              path="/customer-management" 
              element={<PrivateRoute><CustomerManagement /></PrivateRoute>}
            />
            <Route path="/add-customer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
            <Route path="/view-customers" element={<PrivateRoute><ViewCustomers /></PrivateRoute>} />
            <Route path="/edit-customer/:id" element={<PrivateRoute><EditCustomer /></PrivateRoute>} />*/}
            <Route path="/customer-dashboard" element={<PrivateRoute><CustomerDashboard /></PrivateRoute>} />

            {/* Driver Management Route */}

            {/*<Route
              path="/driver-management"
              element={<PrivateRoute><DriverManagement /></PrivateRoute>}
            />            
            <Route path="/add-driver" element={<PrivateRoute><AddDriver /></PrivateRoute>} />
            <Route path="/view-drivers" element={<PrivateRoute><ViewAllDrivers /></PrivateRoute>} />
            <Route path="/edit-driver/:id" element={<PrivateRoute><EditDriver /></PrivateRoute>} />*/}
            <Route path="/driver-dashboard" element={<PrivateRoute><DriverDashboard /></PrivateRoute>} />

            {/* Admin Role Management Route */}
            {/*<Route
              path="/admin-role-management"
              element={<PrivateRoute><AdminRoleManagement /></PrivateRoute>}
            />
            <Route path="/view-admin-roles" element={<PrivateRoute><ViewAllAdmins /></PrivateRoute>} />
            <Route path="/add-admin-role" element={<PrivateRoute><AddAdminRole /></PrivateRoute>} />*/}
            <Route path="/admin-role-dashboard" element={<PrivateRoute><AdminRoleDashboard /></PrivateRoute>} />
            
            {/* Vehicle Management Routes */}
            {/*<Route
              path="/vehicle-management"
              element={<PrivateRoute><VehicleManagement /></PrivateRoute>}
            />
            <Route path="/add-vehicle" element={<PrivateRoute><AddVehicle /></PrivateRoute>} />
            <Route path="/view-vehicles" element={<PrivateRoute><ViewVehicles /></PrivateRoute>} /> 
            <Route path="/vehicles/edit/:id" element={<PrivateRoute><EditVehicle /></PrivateRoute>} />*/}
             <Route path="/vehicle-dashboard" element={<PrivateRoute><VehicleDashboard /></PrivateRoute>} />
            {/* Trip Management Routes */}
            <Route
              path="/trip-management"
              element={<PrivateRoute><TripManagement /></PrivateRoute>}
            />
            <Route path="/create-trip" element={<PrivateRoute><AddTrip /></PrivateRoute>} />
            {/* Product Management Routes */}
            <Route path="/product-management" element={<PrivateRoute><ProductManagement /></PrivateRoute>} />
            <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
            <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
            <Route path="/view-products" element={<PrivateRoute><ViewProducts /></PrivateRoute>} />
           
            <Route path="/publication" element={<PrivateRoute><Publication /></PrivateRoute>} />
            <Route path="/add-publication" element={<PrivateRoute><AddPublication /></PrivateRoute>} />
            <Route path="/view-publications" element={<PrivateRoute><ViewPublications /></PrivateRoute>} />


          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
