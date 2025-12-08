// TripActionButtons.jsx
import React from "react";
import { FaMoneyBillWave, FaCar, FaCalendar, FaCheck, FaPrint } from "react-icons/fa";

const TripActionButtons = ({
  onAddPayment,
  onAddDamage,
  onCompleteTrip,
  onAlterReturnDate,
  onAlterMeter,
  onGetPrint,
}) => {
  const cardStyle =
    "bg-white px-3 py-3 rounded-lg shadow cursor-pointer hover:shadow-md transition flex items-center gap-2";

  const iconBox = "p-2 rounded-md flex items-center justify-center";

  const labelStyle = "font-medium text-sm";

  return (
    <div className="flex flex-row gap-2">
      
      {/* Add Payment */}
      <div className={cardStyle} onClick={onAddPayment}>
        <div className={`${iconBox} bg-blue-50`}>
          <FaMoneyBillWave className="text-blue-600 text-lg" />
        </div>
        <div className={labelStyle}>Add Payment</div>
      </div>

      {/* Add Damage */}
      <div className={cardStyle} onClick={onAddDamage}>
        <div className={`${iconBox} bg-red-50`}>
          <FaCar className="text-red-600 text-lg" />
        </div>
        <div className={labelStyle}>Add Damage</div>
      </div>

      {/* Complete Trip */}
      <div className={cardStyle} onClick={onCompleteTrip}>
        <div className={`${iconBox} bg-green-50`}>
          <FaCheck className="text-green-600 text-lg" />
        </div>
        <div className={labelStyle}>Complete Trip</div>
      </div>

      {/* Alter Dates */}
      <div className={cardStyle} onClick={onAlterReturnDate}>
        <div className={`${iconBox} bg-purple-50`}>
          <FaCalendar className="text-purple-600 text-lg" />
        </div>
        <div className={labelStyle}>Alter Dates</div>
      </div>

      {/* Alter Meter */}
      <div className={cardStyle} onClick={onAlterMeter}>
        <div className={`${iconBox} bg-yellow-50`}>
          <FaCar className="text-yellow-600 text-lg" />
        </div>
        <div className={labelStyle}>Alter Meter</div>
      </div>

      {/* Print */}
      <div className={cardStyle} onClick={onGetPrint}>
        <div className={`${iconBox} bg-indigo-50`}>
          <FaPrint className="text-indigo-600 text-lg" />
        </div>
        <div className={labelStyle}>Print</div>
      </div>
    </div>
  );
};

export default TripActionButtons;
