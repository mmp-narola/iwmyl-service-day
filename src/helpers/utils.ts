import type { Stage } from "@/types/schedulingTypes";
import { format } from "date-fns";

type FormatDateOptions = {
  showTime?: boolean;
  customFormat?: string;
};

const stageOrder: Stage[] = [
  "browse_jobs",
  "express_interest",
  "submit_proposal",
  "pending_confirmation",
  "commitment_confirmed",
  "job_confirmed",
  "job_completion",
  "job_finished",
];

export const getNextStage = (currentStage: Stage): Stage => {
  const currentIndex = stageOrder.indexOf(currentStage);

  if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
    return currentStage;
  }

  return stageOrder[currentIndex + 1];
};

export const formatDateTime = (
  date: string | Date | null | undefined,
  { showTime = false, customFormat }: FormatDateOptions = {},
) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return "-";

  if (customFormat) {
    return format(parsedDate, customFormat);
  }

  return showTime
    ? format(parsedDate, "EEEE, MMMM dd, yyyy, hh:mm a")
    : format(parsedDate, "EEEE, MMMM dd, yyyy");
};

export const formatServiceDateTime = (
  date: string | Date | null | undefined,
  time?: string | null | undefined,
) => {
  if (!date) return "-";

  const formattedDate = formatDateTime(date);
  if (formattedDate === "-") return "-";

  if (!time) return formattedDate;

  try {
    const [hours, minutes] = time.split(":").map(Number);
    const dateWithTime = new Date(date);
    dateWithTime.setHours(hours, minutes, 0, 0);

    return `${formattedDate} at ${format(dateWithTime, "hh:mm a")}`;
  } catch (error) {
    return formattedDate;
  }
};

export const generateHexColorFromString = (str: any) => {
  if (typeof str !== "string" || !str.length) {
    return "#999999"; // fallback color
  }

  let hash = 0;

  // Create hash from string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Control brightness range (readability)
  const min = 60; // avoid too dark
  const max = 200; // avoid too light
  const range = max - min;

  // Generate RGB values from hash
  const r = min + ((hash & 0xff) % range);
  const g = min + (((hash >> 8) & 0xff) % range);
  const b = min + (((hash >> 16) & 0xff) % range);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const getTagList = (value: string[] | string | undefined) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim());
  }

  return [];
};
