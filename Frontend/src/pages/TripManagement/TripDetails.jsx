import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../utils/axiosInstance";
import {
  InfoCard,
  InfoCardSub,
  OneColumnRow,
  CustomerDetails,
  DriverDetails,
  VehicleDetails,
  CostSummary,
  Payments,
} from "./TripDetailsComponents";
import { FaChevronDown, FaChevronUp, FaMoneyBillWave, FaCar, FaUser, FaRedo, FaArrowLeft } from "react-icons/fa";
import TripActionButtons from "./TripAction/TripActionButtons";
import DamageCostModal from "./TripAction/DamageCostModal";
import AddPaymentModal from "./TripAction/AddPaymentModal";
import AlterDatesModal from "./TripAction/AlterDatesModal";
import AlterMeterModal from "./TripAction/AlterMeterModal";
import TripCompleteModal from "./TripAction/TripCompleteModal";
import TripPrintModal from "./TripAction/TripPrintModule";
 
const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [showCustomer, setShowCustomer] = useState(true);
  const [showDriver, setShowDriver] = useState(true);
  const [showVehicle, setShowVehicle] = useState(true);
  const [openDamageModal, setOpenDamageModal] = useState(false);
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [showAlterDatesModal, setShowAlterDatesModal] = useState(false);
const [showAlterMeterModal, setShowAlterMeterModal] = useState(false);
const [showCompleteModal, setShowCompleteModal] = useState(false);
const [showPrintModal, setShowPrintModal] = useState(false);
const [activeTab, setActiveTab] = useState("customer");

 
 
 
  useEffect(() => {
    fetchTrip();
  }, [id]);
 
  const fetchTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTrip(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to fetch trip.");
    } finally {
      setLoading(false);
    }
  };
 
  const formatCurrency = (v) => (v == null ? "-" : `Rs. ${Number(v).toLocaleString()}`);
  const formatDate = (d) => (d ? new Date(d).toLocaleString() : "-");
  const isBase64 = (s) => typeof s === "string" && /^[A-Za-z0-9+/=]+$/.test(s.replace(/\s/g, ""));
 
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg animate-pulse">Loading trip details...</div>
      </div>
    );
 
  if (error)
    return <div className="text-center mt-20 text-red-600 text-lg">❌ {error}</div>;
 
  if (!trip) return <div className="text-center mt-20 text-gray-600">Trip not found</div>;
 
  return (
 <div className="min-h-screen bg-gray-50 p-6">
  <div className="max-w-7xl mx-auto space-y-6">

    {/* Top Row: Trip ID / Status + Back & Refresh */}
    <div className="flex justify-between items-center mb-4">
    </div>

    


        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Participants & Actions */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-600 h-220 p-2 rounded-xl shadow-md mb-6">

  {/* Top Row: Back Button + Trip ID + Status */}
  <div className="flex items-center justify-between mb-2">

    {/* LEFT → Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition flex items-center -mt-11 gap-2"
    >
      <FaArrowLeft size={18} />
    </button>

    {/* CENTER → Trip ID + Status */}
    <div className="flex flex-col items-center flex-1">
      <h2 className="text-2xl font-bold text-white mb-3 mt-2">
        Trip ID: {trip.trip_id}
      </h2>

      <div className="flex flex-wrap gap-2 items-center justify-center mb-4">
        <span
          className={`px-2 py-1 rounded-md font-semibold ${
            trip.trip_status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : trip.trip_status === "Ongoing"
              ? "bg-blue-100 text-blue-800"
              : trip.trip_status === "Completed"
              ? "bg-green-100 text-green-800"
              : trip.trip_status === "Ended"
              ? "bg-gray-200 text-gray-700"
              : trip.trip_status === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {trip.trip_status}
        </span>

        <span
          className={`px-2 py-1 rounded-md font-semibold ${
            trip.payment_status === "Paid"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {trip.payment_status}
        </span>
      </div>
    </div>

    {/* RIGHT → Spacer to keep center alignment */}
    <div className="w-10"></div>
  </div>

  {/* Trip Participants */}
  <InfoCard title="Trip Participants">
    {/* Tabs */}
    <div className="flex gap-4 border-b border-gray-200 pb-2">
      <button
        onClick={() => setActiveTab("customer")}
        className={`px-4 py-2 font-semibold transition ${
          activeTab === "customer"
            ? "border-b-2 border-white text-white"
            : "text-white hover:text-white"
        }`}
      >
        Customer
      </button>

      <button
        onClick={() => setActiveTab("driver")}
        className={`px-4 py-2 font-semibold transition ${
          activeTab === "driver"
            ? "border-b-2 border-white text-white"
            : "text-white hover:text-white"
        }`}
      >
        Driver
      </button>

      <button
        onClick={() => setActiveTab("vehicle")}
        className={`px-4 py-2 font-semibold transition ${
          activeTab === "vehicle"
            ? "border-b-2 border-white text-white"
            : "text-white hover:text-white"
        }`}
      >
        Vehicle
      </button>
    </div>

    {/* Tab Content */}
    <div className="mt-4">
      {activeTab === "customer" && (
        <CustomerDetails trip={trip} isBase64={isBase64} />
      )}

      {activeTab === "driver" && (
        <DriverDetails trip={trip} isBase64={isBase64} />
      )}

      {activeTab === "vehicle" && (
        <VehicleDetails trip={trip} isBase64={isBase64} />
      )}
    </div>
  </InfoCard>
</div>

         
          </div>
 
<DamageCostModal
  open={openDamageModal}
  onClose={() => setOpenDamageModal(false)}
  tripId={trip.trip_id}
  onSuccess={fetchTrip}
/>
 
<AddPaymentModal
  open={showPaymentModal}
  tripId={trip.trip_id}
  onClose={() => setShowPaymentModal(false)}
  onSuccess={fetchTrip}
/>
 
<AlterDatesModal
  open={showAlterDatesModal}
  onClose={() => setShowAlterDatesModal(false)}
  tripId={trip.trip_id}
  onSuccess={fetchTrip}
/>
 
<AlterMeterModal
  open={showAlterMeterModal}
  onClose={() => setShowAlterMeterModal(false)}
  tripId={trip.trip_id}
  onSuccess={fetchTrip}
/>
<TripCompleteModal
  open={showCompleteModal}
  onClose={() => setShowCompleteModal(false)}
  tripId={trip.trip_id}
  onSuccess={fetchTrip}
/>
 
<TripPrintModal
  open={showPrintModal}
  onClose={() => setShowPrintModal(false)}
  tripId={trip.trip_id}
  onSuccess={fetchTrip}
/>

         
 
          {/* Right Column: Trip Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* RIGHT → Action Buttons */}
            <div className="flex justify-end">
              <TripActionButtons
                onAddPayment={() => setShowPaymentModal(true)}
                onAddDamage={() => setOpenDamageModal(true)}
                onCompleteTrip={() => setShowCompleteModal(true)}
                onAlterReturnDate={() => setShowAlterDatesModal(true)}
                onAlterMeter={() => setShowAlterMeterModal(true)}
                onGetPrint={() => setShowPrintModal(true)}
              />
            </div>
            <div className="max-h-[780px] overflow-y-auto pr-2">

          <InfoCardSub title="Trip Summary">
            <div className="bg-gray-100 p-1 rounded-lg">
              <OneColumnRow label="From" value={trip.from_location} />
              <OneColumnRow label="To" value={trip.to_location} />
              <OneColumnRow label="Passengers" value={trip.num_passengers} />
            </div>

            <br />

            <h3 className="text-xl font-bold text-gray-800">Distance & Route</h3>
            <div className="border-b pb-2 mb-4"></div>

            <div className="bg-gray-100 p-1 rounded-lg">
              <OneColumnRow label="Estimated Distance" value={trip.estimated_distance ? trip.estimated_distance + " km" : "-"} />
              <OneColumnRow label="Actual Distance" value={trip.actual_distance ? trip.actual_distance + " km" : "-"} />
              <OneColumnRow label="Start Meter" value={trip.start_meter} />
              <OneColumnRow label="End Meter" value={trip.end_meter} />
            </div>

            <h4 className="mt-3 font-semibold">Route / Map</h4>

            {trip.map?.length ? (
              <ol className="list-decimal list-inside space-y-2 text-sm">
                {trip.map
                  .slice()
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((m) => (
                    <li key={m.map_id}>
                      <span className="font-medium">
                        {m.sequence}. {m.location_name}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {" "}
                        ({m.latitude}, {m.longitude})
                      </span>
                    </li>
                  ))}
              </ol>
            ) : (
              <div className="text-sm text-gray-500">No map locations recorded</div>
            )}

            <br />

            <h3 className="text-xl font-bold text-gray-800">Dates</h3>
            <div className="border-b pb-2 mb-4"></div>

            <div className="bg-gray-100 p-1 rounded-lg">
              <OneColumnRow label="Leaving Date" value={formatDate(trip.leaving_datetime)} />
              <OneColumnRow label="Estimated Return" value={formatDate(trip.estimated_return_datetime)} />
              <OneColumnRow label="Actual Return" value={formatDate(trip.actual_return_datetime)} />
              <OneColumnRow label="Estimated Days" value={trip.estimated_days} />
              <OneColumnRow label="Actual Days" value={trip.actual_days} />
            </div>
          </InfoCardSub>

          <CostSummary
            trip={trip}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />

        </div>

            
 
            {/*<InfoCard title="Distance & Route">
              <OneColumnRow label="Estimated Distance" value={trip.estimated_distance ? trip.estimated_distance + " km" : "-"} />
              <OneColumnRow label="Actual Distance" value={trip.actual_distance ? trip.actual_distance + " km" : "-"} />
              <OneColumnRow label="Start Meter" value={trip.start_meter} />
              <OneColumnRow label="End Meter" value={trip.end_meter} />
 
              <h4 className="mt-3 font-semibold">Route / Map</h4>
              {trip.map?.length ? (
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {trip.map
                    .slice()
                    .sort((a, b) => a.sequence - b.sequence)
                    .map((m) => (
                      <li key={m.map_id}>
                        <span className="font-medium">{m.sequence}. {m.location_name}</span>
                        <span className="text-gray-500 text-xs"> ({m.latitude}, {m.longitude})</span>
                      </li>
                    ))}
                </ol>
              ) : (
                <div className="text-sm text-gray-500">No map locations recorded</div>
              )}
            </InfoCard>
 
            <InfoCard title="Dates">
              <OneColumnRow label="Leaving Date" value={formatDate(trip.leaving_datetime)} />
              <OneColumnRow label="Estimated Return" value={formatDate(trip.estimated_return_datetime)} />
              <OneColumnRow label="Actual Return" value={formatDate(trip.actual_return_datetime)} />
              <OneColumnRow label="Estimated Days" value={trip.estimated_days} />
              <OneColumnRow label="Actual Days" value={trip.actual_days} />
            </InfoCard>*/}
 
          
            {/*<Payments trip={trip} formatCurrency={formatCurrency} formatDate={formatDate} />*/}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default TripDetails;