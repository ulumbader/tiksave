"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { IconClose } from "@/components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = "error" | "warning" | "info" | "success";

type NotificationModalProps = {
  open: boolean;
  onClose: () => void;
  type?: NotificationType;
  title: string;
  message: string;
  /** Optional secondary hint text */
  hint?: string;
  /** Label for the action button (defaults to "Mengerti") */
  actionLabel?: string;
};

// ─── Palette ──────────────────────────────────────────────────────────────────

const palette: Record<NotificationType, {
  accent: string;
  accentText: string;
  badge: string;
  icon: string;
}> = {
  error: {
    accent: "bg-[#ff2d78]",
    accentText: "text-white",
    badge: "bg-[#ff2d78] text-white",
    icon: "✕",
  },
  warning: {
    accent: "bg-[#ff9f1c]",
    accentText: "text-[var(--black)]",
    badge: "bg-[#ff9f1c] text-[var(--black)]",
    icon: "!",
  },
  info: {
    accent: "bg-[#3b82f6]",
    accentText: "text-white",
    badge: "bg-[#3b82f6] text-white",
    icon: "i",
  },
  success: {
    accent: "bg-lime",
    accentText: "text-[var(--black)]",
    badge: "bg-lime text-[var(--black)]",
    icon: "✓",
  },
};

// ─── Animation variants ───────────────────────────────────────────────────────

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 22,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationModal({
  open,
  onClose,
  type = "error",
  title,
  message,
  hint,
  actionLabel = "Mengerti",
}: NotificationModalProps) {
  const colors = palette[type];

  // Close on Escape key
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* ── Blurred backdrop ─────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* ── Modal card ───────────────────────────────────────── */}
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="notif-title"
            aria-describedby="notif-message"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 mx-4 w-full max-w-md border-2 border-black bg-white shadow-[8px_8px_0_#000]"
          >
            {/* ── Header bar ─────────────────────────────────────── */}
            <div
              className={`flex items-center justify-between gap-3 border-b-2 border-black px-5 py-4 ${colors.accent} ${colors.accentText}`}
            >
              <p
                id="notif-title"
                className="font-syne text-xl font-black leading-tight"
              >
                {title}
              </p>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup notifikasi"
                className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black bg-white text-[var(--black)] shadow-[2px_2px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>

            {/* ── Body ───────────────────────────────────────────── */}
            <div className="px-5 py-5">
              <p
                id="notif-message"
                className="text-base font-medium leading-7 text-[var(--black)]"
              >
                {message}
              </p>

              {hint && (
                <p className="mt-2 text-sm leading-6 text-[var(--black)]/60">
                  {hint}
                </p>
              )}

              {/* Action button */}
              <button
                type="button"
                onClick={onClose}
                className="btn-brutal mt-5 w-full bg-lime px-5 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]"
              >
                {actionLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
