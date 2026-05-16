import { UserModel, type UserDocument } from "../models/user.model.js";
import type { UserRole } from "../types/auth.types.js";

type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export const userRepository = {
  async create(data: CreateUserData): Promise<UserDocument> {
    return UserModel.create(data);
  },

  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  },

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).select("+passwordHash");
  },

  async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }
};
