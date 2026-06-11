/**
 * Format a UTC date string to IST (Indian Standard Time, UTC+5:30).
 * All times on the site are displayed in IST.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // +5:30 in milliseconds

/** Convert a date to IST and return the Date object adjusted to IST */
function toIST(date: Date): Date {
  // Get UTC time, then add IST offset
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utcMs + IST_OFFSET_MS);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Format: "Jun 11, 12:30"  (short date + time in IST)
 */
export function formatMatchDate(dateStr: string): string {
  const ist = toIST(new Date(dateStr));
  const month = MONTHS[ist.getMonth()];
  const day = ist.getDate();
  const hours = pad(ist.getHours());
  const minutes = pad(ist.getMinutes());
  return `${month} ${day}, ${hours}:${minutes} IST`;
}

/**
 * Format: "11 Jun 2026 · 12:30"  (full date + time in IST)
 */
export function formatMatchDateFull(dateStr: string): string {
  const ist = toIST(new Date(dateStr));
  const day = ist.getDate();
  const month = MONTHS[ist.getMonth()];
  const year = ist.getFullYear();
  const hours = pad(ist.getHours());
  const minutes = pad(ist.getMinutes());
  return `${day} ${month} ${year} · ${hours}:${minutes} IST`;
}

/**
 * Format: "Jun 11, 2026"  (date only in IST, no time)
 */
export function formatDateOnly(dateStr: string): string {
  const ist = toIST(new Date(dateStr));
  const month = MONTHS[ist.getMonth()];
  const day = ist.getDate();
  const year = ist.getFullYear();
  return `${month} ${day}, ${year}`;
}
