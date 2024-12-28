import React from 'react';

const ConfirmDelete = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
        <p>{message || "Are you sure you want to delete this item?"}</p>
        <div className="mt-4 flex justify-end space-x-3">
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
