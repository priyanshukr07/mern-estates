import React from 'react';

const ConfirmDelete = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <p>{message || "Are you sure you want to delete this item?"}</p>
        <div className="flex gap-4 mt-4">
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">
            Confirm
          </button>
          <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
