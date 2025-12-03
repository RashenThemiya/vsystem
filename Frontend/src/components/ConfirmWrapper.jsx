import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi"; // Default icon for warnings

const ConfirmWrapper = ({
  onConfirm,
  children,
  message,
  additionalInfo,
  confirmText = "Yes, Proceed",
  cancelText = "Cancel",
  icon,
  buttonTextColor = "text-white",
  buttonBackgroundColor = "bg-red-600",
  isLoading = false, // Added isLoading prop
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Stop event bubbling/default action from the trigger button
  const handleChildClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Crucial to prevent double firing/bubbling
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onConfirm();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Define modal backdrop and content animation variants
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.3 } },
    hidden: { scale: 0.9, opacity: 0, y: 50 },
  };

  // Determine the icon to display (use FiAlertTriangle as a default warning)
  const DisplayIcon = icon || <FiAlertTriangle />;

  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={handleCancel} // Close modal when clicking outside
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-2xl space-y-6 w-full max-w-sm flex flex-col"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Header with custom icon and message */}
              <div className="flex flex-col items-center text-center">
                <div className={`text-5xl mb-4 ${buttonBackgroundColor.replace('bg-', 'text-') || 'text-red-600'}`}>
                    {DisplayIcon}
                </div>
                <p className="text-xl font-bold text-gray-800">{message}</p>
              </div>

              {/* Optional additional info */}
              {additionalInfo && (
                <div className="text-sm text-gray-500 text-center border-t pt-4">
                  {additionalInfo}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col space-y-3 mt-6 w-full">
                {/* Confirm Button */}
                <button
                  onClick={handleConfirm}
                  className={`
                    ${buttonBackgroundColor} ${buttonTextColor} 
                    w-full px-6 py-3 rounded-xl text-md font-semibold transition duration-200 shadow-md
                    ${isLoading ? 'opacity-70 cursor-wait' : 'hover:opacity-90'}
                  `}
                  disabled={isLoading} // Disabled when loading
                >
                  {confirmText}
                </button>
                
                {/* Cancel Button */}
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 w-full px-6 py-3 rounded-xl text-md font-medium hover:bg-gray-300 transition duration-200 disabled:opacity-50"
                  disabled={isLoading} // Disabled when loading
                >
                  {cancelText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button/content */}
      <div onClick={handleChildClick}>
        {children}
      </div>
    </>
  );
};

export default ConfirmWrapper;