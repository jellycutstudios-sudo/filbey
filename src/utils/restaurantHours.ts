/**
 * Filbey Restaurant Hours Utility
 * Open: 11:30 AM – 11:30 PM IST, every day
 */

export interface OpenStatus {
  isOpen: boolean;
  /** Human-readable label e.g. "Open Now" or "Closed · Opens at 11:30 AM" */
  label: string;
  /** Short label for tight UI e.g. "Open" / "Closed" */
  shortLabel: string;
  /** Minutes until closing (if open) or minutes until opening (if closed) */
  minutesUntilChange: number;
}

const OPEN_HOUR = 11;
const OPEN_MINUTE = 30;
const CLOSE_HOUR = 23;
const CLOSE_MINUTE = 30;

/** Returns the current time in IST as { hours, minutes } */
function getISTTime(): { hours: number; minutes: number } {
  const now = new Date();
  // IST = UTC + 5:30
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const istMs = utcMs + 5.5 * 60 * 60_000;
  const ist = new Date(istMs);
  return { hours: ist.getHours(), minutes: ist.getMinutes() };
}

function toMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

export function getRestaurantStatus(): OpenStatus {
  const { hours, minutes } = getISTTime();
  const nowMins = toMinutes(hours, minutes);
  const openMins = toMinutes(OPEN_HOUR, OPEN_MINUTE);
  const closeMins = toMinutes(CLOSE_HOUR, CLOSE_MINUTE);

  const isOpen = nowMins >= openMins && nowMins < closeMins;

  if (isOpen) {
    const minutesUntilChange = closeMins - nowMins;
    const hoursLeft = Math.floor(minutesUntilChange / 60);
    const minsLeft = minutesUntilChange % 60;

    let label = 'Open Now';
    if (minutesUntilChange <= 60) {
      label = `Open · Closes in ${minutesUntilChange} min`;
    } else {
      label = `Open Now · Closes at 11:30 PM`;
    }

    return {
      isOpen: true,
      label,
      shortLabel: 'Open Now',
      minutesUntilChange,
    };
  } else {
    const minutesUntilChange =
      nowMins < openMins ? openMins - nowMins : 24 * 60 - nowMins + openMins;

    return {
      isOpen: false,
      label: `Closed · Opens at 11:30 AM`,
      shortLabel: 'Closed',
      minutesUntilChange,
    };
  }
}

export function isRestaurantOpen(): boolean {
  return getRestaurantStatus().isOpen;
}
