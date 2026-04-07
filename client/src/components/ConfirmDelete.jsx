import React from 'react';

const ConfirmDelete = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 px-4 backdrop-blur-sm">
      <div className="max-w-md rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.45)]">
        <p className="text-lg font-semibold text-stone-900">Confirm action</p>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          {message || "Are you sure you want to delete this item?"}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onConfirm} className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">
            Confirm
          </button>
          <button onClick={onCancel} className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-900 hover:text-stone-900">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
