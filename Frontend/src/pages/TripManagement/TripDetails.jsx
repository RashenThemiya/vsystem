import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import {
  InfoCard,
  OneColumnRow,
  CustomerDetails,
  DriverDetails,
  VehicleDetails,
  CostSummary,
  Payments,
} from "./TripDetailsComponents";
import { FaChevronDown, FaChevronUp, FaMoneyBillWave, FaCar, FaUser } from "react-icons/fa";
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Trip #{trip.trip_id}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Status: <span className="font-medium">{trip.trip_status}</span> • Payment:{" "}
              <span className="font-medium">{trip.payment_status}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              onClick={fetchTrip}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition flex items-center gap-2"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Participants & Actions */}
          <div className="space-y-4">
            {/* Action Buttons */}
            
<TripActionButtons
  onAddPayment={() => setShowPaymentModal(true)}
  onAddDamage={() => setOpenDamageModal(true)}
  onCompleteTrip={() => setShowCompleteModal(true)}
  onAlterReturnDate={() => setShowAlterDatesModal(true)}
  onAlterMeter={() => setShowAlterMeterModal(true)}
  onGetPrint={() => setShowPrintModal(true)} // <-- new print handler
/>

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

        

            <InfoCard title="Trip Participants">
              {/* Customer */}
              <div className="mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer text-gray-700 font-semibold hover:text-teal-600 transition"
                  onClick={() => setShowCustomer((s) => !s)}
                >
                  <span className="flex items-center gap-2">
                    <FaUser /> Customer
                  </span>
                  <span className="text-blue-600 underline">{showCustomer ? "Hide" : "Show"}</span>
                </div>
                {showCustomer && <CustomerDetails trip={trip} isBase64={isBase64} />}
              </div>

              {/* Driver */}
              <div className="mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer text-gray-700 font-semibold hover:text-teal-600 transition"
                  onClick={() => setShowDriver((s) => !s)}
                >
                  <span className="flex items-center gap-2">
                    <FaUser /> Driver
                  </span>
                  <span className="text-blue-600 underline">{showDriver ? "Hide" : "Show"}</span>
                </div>
                {showDriver && <DriverDetails trip={trip} isBase64={isBase64} />}
              </div>

              {/* Vehicle */}
              <div className="mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer text-gray-700 font-semibold hover:text-teal-600 transition"
                  onClick={() => setShowVehicle((s) => !s)}
                >
                  <span className="flex items-center gap-2">
                    <FaCar /> Vehicle
                  </span>
                  <span className="text-blue-600 underline">{showVehicle ? "Hide" : "Show"}</span>
                </div>
                {showVehicle && <VehicleDetails trip={trip} isBase64={isBase64} />}
              </div>
            </InfoCard>
          </div>

          {/* Right Column: Trip Info */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="Trip Summary">
              <OneColumnRow label="From" value={trip.from_location} />
              <OneColumnRow label="To" value={trip.to_location} />
              <OneColumnRow label="Up / Down" value={trip.up_down} />
              <OneColumnRow label="Passengers" value={trip.num_passengers} />
              <OneColumnRow label="Driver Required" value={trip.driver_required} />
              <OneColumnRow label="Fuel Required" value={trip.fuel_required} />
            </InfoCard>

            <InfoCard title="Distance & Route">
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
            </InfoCard>

            <CostSummary trip={trip} formatCurrency={formatCurrency} />
            <Payments trip={trip} formatCurrency={formatCurrency} formatDate={formatDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
