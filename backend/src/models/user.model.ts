import { Schema, model, type HydratedDocument } from "mongoose";
import { userRoles, type UserRole } from "../types/auth.types.js";

export type User = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      required: true,
      enum: userRoles,
      default: "sales"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type UserDocument = HydratedDocument<User>;

export const UserModel = model<User>("User", userSchema);
