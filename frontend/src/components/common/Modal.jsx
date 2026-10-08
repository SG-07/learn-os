// frontend/src/components/common/Modal.jsx

import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4.5 dark:border-slate-800">
          <h2
            id="modal-title"
            className="text-base font-bold text-slate-900 dark:text-white sm:text-lg"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;

