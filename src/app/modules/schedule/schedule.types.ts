export type Slot = {
  startDateTime: Date;
  endDateTime: Date;
};

export type ScheduleFilterParams = {
  searchTerm?: string;
  endDate?: string;
  startDate?: string;
  [key: string]: any;
};