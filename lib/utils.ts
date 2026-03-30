import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function localInputToGMT(value: string) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return dayjs
    .tz(value, tz) // pakai timezone user
    .utc()
    .toISOString();
}

export function gmtToInputValue(gmtDate: string) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return dayjs.utc(gmtDate).tz(tz).format("YYYY-MM-DDTHH:mm");
}
