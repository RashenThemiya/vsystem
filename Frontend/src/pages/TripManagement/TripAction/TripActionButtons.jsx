// TripActionButtons.jsx
import React from "react";
import { FaMoneyBillWave, FaCar, FaChevronDown, FaPrint } from "react-icons/fa";

const TripActionButtons = ({
  onAddPayment,
  onAddDamage,
  onCompleteTrip,
  onAlterReturnDate,
  onAlterMeter,
  onGetPrint,
}) => {
  // Consistent button style for all buttons
  const buttonStyle =
    "flex items-center gap-2 justify-center px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition duration-200";

  return (
    <div className="flex flex-col gap-3">
      <button onClick={onAddPayment} className={buttonStyle}>
        <FaMoneyBillWave /> Add Payment
      </button>

      <button onClick={onAddDamage} className={buttonStyle}>
        <FaCar /> Add Damage Cost
      </button>

      <button onClick={onCompleteTrip} className={buttonStyle}>
        <FaChevronDown /> Complete Trip
      </button>

      <button onClick={onAlterReturnDate} className={buttonStyle}>
        Alter Leave/Return Date
      </button>

      <button onClick={onAlterMeter} className={buttonStyle}>
        Alter Start/End Meter
      </button>

      <button onClick={onGetPrint} className={buttonStyle}>
        <FaPrint /> Get Print
      </button>
    </div>
  );
};

export default TripActionButtons;
