import { Schema, model, type HydratedDocument } from "mongoose";
import { leadSources, leadStatuses, type LeadSource, type LeadStatus } from "../types/lead.types.js";

export type Lead = {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
};

const leadSchema = new Schema<Lead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 120
    },
    status: {
      type: String,
      required: true,
      enum: leadStatuses,
      default: "new"
    },
    source: {
      type: String,
      required: true,
      enum: leadSources
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ email: 1 });

export type LeadDocument = HydratedDocument<Lead>;

export const LeadModel = model<Lead>("Lead", leadSchema);
