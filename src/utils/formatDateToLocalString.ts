// src/utils/dateFormatter.ts
import logger from "./logger";

function pad(n: number, width = 2) {
  return String(n).padStart(width, '0');
}

function formatDateToLocalString(d: Date): string {
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());

  let hour = d.getHours();
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${year}-${month}-${day} ${pad(hour)}:${minute}:${second} ${ampm}`;
}

export function formatDatesInResponse(value: any): any {
  try {
    if (value === null || value === undefined) return value;

    // Case 1: Date instance
    if (value instanceof Date) return formatDateToLocalString(value);

    // Case 2: Array
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        value[i] = formatDatesInResponse(value[i]);
      }
      return value;
    }

    // Case 3: Object (plain JSON or Sequelize data)
    if (typeof value === 'object') {
      for (const key in value) {
        if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
        const v = value[key];

        if (v instanceof Date) {
          value[key] = formatDateToLocalString(v);
        } else if (Array.isArray(v) || (v && typeof v === 'object')) {
          formatDatesInResponse(v); // mutate in place
        } else if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(v)) {
          const parsed = new Date(v.replace(' ', 'T'));
          if (!isNaN(parsed.getTime())) {
            value[key] = formatDateToLocalString(parsed);
          }
        }
      }
    }

    return value;
  } catch (e) {
    logger.error('Date conversion failed:', e);
    return value;
  }
}

export function getISTDate() {
  const dateUTC = new Date(); // default is UTC internally
  const istOffsetMs = 5.5 * 60 * 60 * 1000; // +5h30m in milliseconds
  const dateIST = new Date(dateUTC.getTime() + istOffsetMs);

  return dateIST;
}
