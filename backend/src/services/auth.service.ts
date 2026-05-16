import { userRepository } from "../repositories/user.repository.js";
import type { AuthUser } from "../types/auth.types.js";
import { ApiError } from "../utils/api-error.js";
import { signAccessToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { serializeUser } from "../utils/serialize-user.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";

type AuthResult = {
  user: AuthUser;
  token: string;
};

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw ApiError.conflict("A user with this email already exists");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "sales"
    });

    const serializedUser = serializeUser(user);

    return {
      user: serializedUser,
      token: signAccessToken(serializedUser.id, serializedUser.role)
    };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithPassword(input.email);

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await verifyPassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const serializedUser = serializeUser(user);

    return {
      user: serializedUser,
      token: signAccessToken(serializedUser.id, serializedUser.role)
    };
  },

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw ApiError.unauthorized("User no longer exists");
    }

    return serializeUser(user);
  }
};
