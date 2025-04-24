export type TDoctorFilterParams = {
  searchTerm?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  registrationNumber?: string;
  appointmentFee?: number;
  experience?: number;
  gender?: string;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
  averageRating?: number;
  [key: string]: any;
};