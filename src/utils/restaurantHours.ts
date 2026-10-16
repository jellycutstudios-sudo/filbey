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
  /** Formatted human string e.g. "18 mins" or "2h 15m" */
  timeFormatted: string;
}

const OPEN_HOUR = 11;
const OPEN_MINUTE = 30;
const CLOSE_HOUR = 23;
const CLOSE_MINUTE = 30;

/** Returns the current time in IST as { hours, minutes } */
export function getISTTime(): { hours: number; minutes: number } {
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

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? '' : 's'}`;
  }
  const hrs = Math.floor(minutes / 60);
  const remMins = minutes % 60;
  return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs} hr${hrs > 1 ? 's' : ''}`;
}

export function getRestaurantStatus(): OpenStatus {
  const { hours, minutes } = getISTTime();
  const nowMins = toMinutes(hours, minutes);
  const openMins = toMinutes(OPEN_HOUR, OPEN_MINUTE);
  const closeMins = toMinutes(CLOSE_HOUR, CLOSE_MINUTE);

  const isOpen = nowMins >= openMins && nowMins < closeMins;

  if (isOpen) {
    const minutesUntilChange = closeMins - nowMins;
    const timeFormatted = formatMinutes(minutesUntilChange);

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
      timeFormatted,
    };
  } else {
    const minutesUntilChange =
      nowMins < openMins ? openMins - nowMins : 24 * 60 - nowMins + openMins;
    const timeFormatted = formatMinutes(minutesUntilChange);

    return {
      isOpen: false,
      label: `Closed · Opens at 11:30 AM`,
      shortLabel: 'Closed',
      minutesUntilChange,
      timeFormatted,
    };
  }
}

export function isRestaurantOpen(): boolean {
  return getRestaurantStatus().isOpen;
}

/** Generate dynamic schedule delivery slots */
export function getAvailableDeliverySlots(): string[] {
  const { hours, minutes } = getISTTime();
  const nowMins = hours * 60 + minutes;
  const isLateNight = nowMins >= 23 * 60 + 30 || nowMins < 4 * 60;
  const dayPrefix = isLateNight ? 'Tomorrow' : 'Today';

  const defaultSlots = [
    `${dayPrefix} ~12:00 PM (Opening Prep)`,
    `${dayPrefix} 12:30 PM – 1:00 PM`,
    `${dayPrefix} 1:00 PM – 1:30 PM`,
    `${dayPrefix} 1:30 PM – 2:00 PM`,
    `${dayPrefix} 2:00 PM – 2:30 PM`,
    `${dayPrefix} 7:00 PM – 7:30 PM (Dinner)`,
    `${dayPrefix} 7:30 PM – 8:00 PM`,
    `${dayPrefix} 8:00 PM – 8:30 PM`,
    `${dayPrefix} 8:30 PM – 9:00 PM`,
    `${dayPrefix} 9:00 PM – 9:30 PM`,
    `${dayPrefix} 9:30 PM – 10:00 PM`,
  ];

  if (isLateNight) return defaultSlots;

  // Filter slots that have already passed today
  const filtered = defaultSlots.filter(slot => {
    if (slot.includes('12:00 PM') && nowMins >= 12 * 60) return false;
    if (slot.includes('12:30 PM') && nowMins >= 12 * 60 + 30) return false;
    if (slot.includes('1:00 PM') && nowMins >= 13 * 60) return false;
    if (slot.includes('1:30 PM') && nowMins >= 13 * 60 + 30) return false;
    if (slot.includes('2:00 PM') && nowMins >= 14 * 60) return false;
    if (slot.includes('7:00 PM') && nowMins >= 19 * 60) return false;
    if (slot.includes('7:30 PM') && nowMins >= 19 * 60 + 30) return false;
    if (slot.includes('8:00 PM') && nowMins >= 20 * 60) return false;
    if (slot.includes('8:30 PM') && nowMins >= 20 * 60 + 30) return false;
    if (slot.includes('9:00 PM') && nowMins >= 21 * 60) return false;
    if (slot.includes('9:30 PM') && nowMins >= 21 * 60 + 30) return false;
    return true;
  });

  return filtered.length > 0 ? filtered : [`${dayPrefix} 11:30 AM (Tomorrow Opening)`];
}
