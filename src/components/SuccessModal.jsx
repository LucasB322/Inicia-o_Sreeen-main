import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SuccessModal = ({
  open,
  message = "Operação realizada com sucesso!",
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* MODAL CARD */}
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
          >
            {/* Ícone */}
            <div className="text-green-600 text-5xl mb-4">
              <i className="fas fa-check-circle"></i>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Sucesso!
            </h2>

            <p className="text-gray-600 mb-6">{message}</p>

            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium w-full transition"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
