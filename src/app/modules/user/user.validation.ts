import { Gender } from "@prisma/client";
import { z } from "zod";

export const adminCreationSchema = z.object({
    password: z.string({required_error: "Password is required"}),
    admin: z.object({
        name: z.string({ required_error: "name is required" }),
        email: z.string({ required_error: "email is required" })
            .email("Invalid email address"),
        contactNumber: z.string({required_error:"Contact number is required"})
    }),

})

export const patientCreationSchema = z.object({
  password: z.string({ required_error: "Password is required" }),
  patient: z.object({
    name: z.string({ required_error: "name is required" }),
    email: z
      .string({ required_error: "email is required" })
      .email("Invalid email address"),
    contactNumber: z.string({ required_error: "Contact number is required" }),
    address: z.string().optional(),
  }),
});

export const doctorCreationSchema = z.object({
  password: z.string({ required_error: "Password is required" }),
    doctor: z.object({
        name: z.string({ required_error: "name is required" }),
        email: z
            .string({ required_error: "email is required" })
            .email("Invalid email address"),
        contactNumber: z.string({ required_error: "Contact number is required" }),
        address: z.string().optional(),
        registrationNumber: z.string({
            required_error: "Registration number is required",
        }),
        experience: z.number().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number({ required_error: "Appointment fee is required" }),
        qualification: z.string({ required_error: "Qualification is required" }),
        currentWorkingPlace: z.string({ required_error: "Current working place is required" }),
        designation: z.string({ required_error: "Designation is required " }),
        averageRating: z.number({required_error: "Average rating is required"})
  }),
});