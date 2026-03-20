export type ViewMode = "volunteer" | "client";

export type FlowStage =
  | "browse_jobs"
  | "express_interest"
  | "submit_proposal"
  | "pending_confirmation"
  | "commitment_confirmed"
  | "job_confirmed"
  | "job_completion"
  | "job_finished";

export type Tab = "opportunities" | "my-tasks" | "history" | "organizer";

export type TimeSlot = {
  id: string;
  date: string;
  time: string;
};

export type Job = {
  id: string | number;

  photo?: string | null;
  zip: string;
  city?: string;
  state?: string;

  description: string;

  equipment?: string | null;
  equipment_type?: string | null;

  first_name: string;
  last_name: string;

  phone_number?: string;
  requested_datetimes?: string[];
  request_id?: string;
  dateTime?: string;
  service_date?: string;
  service_for?: string;
  address?: any | null;
  service_requested?: string[];
};

export type DateTimeValue = string | null;

export interface DateTimePickerProps {
  id?: string;
  value?: DateTimeValue;
  onChange?: (value: DateTimeValue) => void;
  placeholder?: string;
  className?: string;
  disabledDates?: (date: Date) => boolean;
}

export interface JobsCountProps {
  onCountChange?: (count: number) => void;
}

export type Stage =
  | "browse_jobs"
  | "express_interest"
  | "submit_proposal"
  | "pending_confirmation"
  | "commitment_confirmed"
  | "job_confirmed"
  | "job_completion"
  | "job_finished";
