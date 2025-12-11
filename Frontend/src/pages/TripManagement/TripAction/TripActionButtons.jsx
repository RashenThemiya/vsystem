import React from "react";
import {
  FaMoneyBillWave,
  FaCar,
  FaCalendar,
  FaCheck,
  FaPrint,
  FaPlay,
  FaStop,
  FaTimesCircle
} from "react-icons/fa";

const TripActionButtons = ({
  tripStatus, // ✅ new prop
  onAddPayment,
  onAddDamage,
  onCompleteTrip,
  onAlterReturnDate,
  onAlterMeter,
  onGetPrint,
  onStartTrip,
  onEndTrip,
  onCancelTrip,
}) => {
  const cardStyle =
    "bg-white px-3 py-2 rounded-lg shadow cursor-pointer hover:shadow-md transition flex items-center gap-2 text-sm";
  const iconBox = "p-2 rounded-md flex items-center justify-center";

  // Determine which buttons to show
  const showStart = tripStatus === "Pending";
  const showEnd = tripStatus === "Ongoing";
  const showComplete = tripStatus === "Ended";
  const showPrint = tripStatus === "Ended" || tripStatus === "Completed";
  const showCancel = tripStatus === "Pending" || tripStatus === "Ongoing";
  const showAlter = tripStatus !== "Completed" && tripStatus !== "Cancelled";
  const showAddPayment = tripStatus !== "Completed" && tripStatus !== "Cancelled";
  const showAddDamage = tripStatus !== "Completed" && tripStatus !== "Cancelled";

  return (
    <div className="flex flex-wrap gap-2">
      {showStart && (
        <div className={cardStyle} onClick={onStartTrip}>
          <div className={`${iconBox} bg-green-50`}>
            <FaPlay className="text-green-600 text-base" />
          </div>
          <div>Start Trip</div>
        </div>
      )}

      {showEnd && (
        <div className={cardStyle} onClick={onEndTrip}>
          <div className={`${iconBox} bg-red-50`}>
            <FaStop className="text-red-600 text-base" />
          </div>
          <div>End Trip</div>
        </div>
      )}

      {showAddPayment && (
        <div className={cardStyle} onClick={onAddPayment}>
          <div className={`${iconBox} bg-blue-50`}>
            <FaMoneyBillWave className="text-blue-600 text-base" />
          </div>
          <div>Add Payment</div>
        </div>
      )}

      {showAddDamage && (
        <div className={cardStyle} onClick={onAddDamage}>
          <div className={`${iconBox} bg-red-50`}>
            <FaCar className="text-red-600 text-base" />
          </div>
          <div>Add Damage</div>
        </div>
      )}

      {showComplete && (
        <div className={cardStyle} onClick={onCompleteTrip}>
          <div className={`${iconBox} bg-green-50`}>
            <FaCheck className="text-green-600 text-base" />
          </div>
          <div>Complete Trip</div>
        </div>
      )}

      {showAlter && (
        <>
          <div className={cardStyle} onClick={onAlterReturnDate}>
            <div className={`${iconBox} bg-purple-50`}>
              <FaCalendar className="text-purple-600 text-base" />
            </div>
            <div>Alter Dates</div>
          </div>

          <div className={cardStyle} onClick={onAlterMeter}>
            <div className={`${iconBox} bg-yellow-50`}>
              <FaCar className="text-yellow-600 text-base" />
            </div>
            <div>Alter Meter</div>
          </div>
        </>
      )}

      {showPrint && (
        <div className={cardStyle} onClick={onGetPrint}>
          <div className={`${iconBox} bg-indigo-50`}>
            <FaPrint className="text-indigo-600 text-base" />
          </div>
          <div>Print</div>
        </div>
      )}

      {showCancel && (
        <div className={cardStyle} onClick={onCancelTrip}>
          <div className={`${iconBox} bg-red-100`}>
            <FaTimesCircle className="text-red-700 text-base" />
          </div>
          <div>Cancel Trip</div>
        </div>
      )}
    </div>
  );
};

export default TripActionButtons;
