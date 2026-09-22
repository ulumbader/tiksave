/**
 * Custom SVG icon components for SedotVidio.
 *
 * Design language: neo-brutalist — thick fills, bold shapes,
 * high contrast, no wishy-washy thin strokes.
 *
 * Every icon uses `fill="currentColor"` for maximum boldness
 * and inherits text color from parent.
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// ─── Link / Chain ─────────────────────────────────────────────────────────────
// Two interlocked bold chain links — represents "paste link"
export function IconLink(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M17 7h-3a1.5 1.5 0 0 0 0 3h3a2 2 0 0 1 0 4h-3a1.5 1.5 0 0 0 0 3h3a5 5 0 0 0 0-10z" />
      <path d="M7 17h3a1.5 1.5 0 0 0 0-3H7a2 2 0 0 1 0-4h3a1.5 1.5 0 0 0 0-3H7a5 5 0 0 0 0 10z" />
      <rect x="8" y="10.5" width="8" height="3" rx="1.5" />
    </svg>
  );
}

// ─── Headphones ───────────────────────────────────────────────────────────────
// Bold filled headphones — represents "choose format / audio"
export function IconHeadphones(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H4.07A8 8 0 0 1 12 4a8 8 0 0 1 7.93 8H18a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-6c0-5.52-4.48-10-10-10z" />
    </svg>
  );
}

// ─── Download Arrow ───────────────────────────────────────────────────────────
// Bold downward arrow with tray — primary download action
export function IconDownload(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M13.5 3h-3v8H7l5 5.5L17 11h-3.5V3z" />
      <rect x="4" y="19" width="16" height="3" rx="0" />
    </svg>
  );
}

// ─── Chevron Left ─────────────────────────────────────────────────────────────
export function IconChevronLeft(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

// ─── Chevron Right ────────────────────────────────────────────────────────────
export function IconChevronRight(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
    </svg>
  );
}

// ─── Close / X ────────────────────────────────────────────────────────────────
// Bold filled X
export function IconClose(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
    </svg>
  );
}

// ─── Music Note ───────────────────────────────────────────────────────────────
// Bold filled music note with flag — represents MP3
export function IconMusicNote(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M12 3v12.26A3.5 3.5 0 1 0 14 18V8h4V3h-6z" />
    </svg>
  );
}

// ─── Video / Play ─────────────────────────────────────────────────────────────
// Bold play button in a rounded rect — represents MP4 video
export function IconVideo(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm6 4v8l6-4-6-4z" />
    </svg>
  );
}

// ─── Camera ───────────────────────────────────────────────────────────────────
// Bold filled camera — represents photo posts
export function IconCamera(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M9 2l-1.83 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.17L15 2H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  );
}

// ─── Gear / Cog ───────────────────────────────────────────────────────────────
// Bold filled gear — represents converting / processing
export function IconGear(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
    </svg>
  );
}

// ─── Spinner / Loading ────────────────────────────────────────────────────────
// Circular spinner — represents downloading in progress
export function IconSpinner(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={24}
      height={24}
      {...props}
    >
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="square"
      />
    </svg>
  );
}

// ─── Coffee ───────────────────────────────────────────────────────────────────
// Bold filled coffee mug — "Dibuat dengan ☕"
export function IconCoffee(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M2 19h18v2H2v-2zM18 7H4v8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-2h1a3 3 0 0 0 0-6h-1zm1 4h-1V9h1a1 1 0 0 1 0 2z" />
      <rect x="7" y="2" width="2" height="3" rx="1" />
      <rect x="11" y="2" width="2" height="3" rx="1" />
    </svg>
  );
}

// ─── FAQ Chevron (angled bracket) ─────────────────────────────────────────────
// Bold right-pointing chevron for FAQ accordion
export function IconFaqChevron(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
    </svg>
  );
}

// ─── Minus ─────────────────────────────────────────────────────────────────────
export function IconMinus(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <rect x="5" y="10" width="14" height="4" rx="0" />
    </svg>
  );
}

// ─── Plus ──────────────────────────────────────────────────────────────────────
export function IconPlus(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <path d="M10 5h4v5h5v4h-5v5h-4v-5H5v-4h5V5z" />
    </svg>
  );
}
