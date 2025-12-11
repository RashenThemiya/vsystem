// ModalWrapper.jsx
export default function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex justify-center items-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        {children}
      </div>
    </div>
  );
}
