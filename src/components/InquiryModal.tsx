"use client";

import React, { useState } from "react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    representative: "Individual Buyer",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl transition-all duration-300">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-neutral-950/95 border border-white/20 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-neutral-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle top border highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {!submitted ? (
          <div>
            <div className="mb-5">
              <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400">
                Private Acquisition Concierge
              </span>
              <h2 className="text-xl font-serif font-light text-white mt-1">
                Request Private Viewing
              </h2>
              <p className="text-xs text-neutral-400 mt-1.5 font-light leading-relaxed">
                Direct portfolio consultation for Patel Villa. All inquiries are managed under strict confidentiality.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lord / Lady / M."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-900/80 border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@sanctuary.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900/80 border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1">
                    Direct Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+33 6 00 00 00 00"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900/80 border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1">
                  Representation
                </label>
                <select
                  value={formData.representative}
                  onChange={(e) =>
                    setFormData({ ...formData, representative: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-900/80 border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white transition-colors"
                >
                  <option value="Individual Buyer">Private Principal</option>
                  <option value="Family Office">Family Office Advisory</option>
                  <option value="Architectural Curator">Architectural Curator</option>
                  <option value="Institutional">Private Real Estate Trustee</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1">
                  Preferred Dates & Confidential Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Helicopter transfer preference, architectural focus..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-900/80 border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white placeholder-neutral-600 transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-neutral-950 font-medium text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all shadow-lg active:scale-95"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center mb-4 text-white">
              ✓
            </div>
            <h3 className="text-xl font-serif text-white">
              Inquiry Dispatched
            </h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-xs font-light">
              Our private client director will reach out via confidential channels within 4 business hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
