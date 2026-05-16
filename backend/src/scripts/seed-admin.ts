import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/password.js";

const requiredAdminEnv = ["ADMIN_NAME", "ADMIN_EMAIL", "ADMIN_PASSWORD"] as const;

type AdminSeedEnv = {
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
};

const getAdminSeedEnv = (): AdminSeedEnv => {
  const missing = requiredAdminEnv.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing admin seed environment values: ${missing.join(", ")}`);
  }

  return {
    ADMIN_NAME: env.ADMIN_NAME,
    ADMIN_EMAIL: env.ADMIN_EMAIL,
    ADMIN_PASSWORD: env.ADMIN_PASSWORD
  } as AdminSeedEnv;
};

const seedAdmin = async (): Promise<void> => {
  const adminEnv = getAdminSeedEnv();
  await connectDatabase();

  const existingUser = await userRepository.findByEmail(adminEnv.ADMIN_EMAIL);

  if (existingUser) {
    if (existingUser.role === "admin") {
      console.log(`Admin already exists: ${adminEnv.ADMIN_EMAIL}`);
      return;
    }

    throw new Error(`A non-admin user already exists with email: ${adminEnv.ADMIN_EMAIL}`);
  }

  const passwordHash = await hashPassword(adminEnv.ADMIN_PASSWORD);

  await userRepository.create({
    name: adminEnv.ADMIN_NAME,
    email: adminEnv.ADMIN_EMAIL,
    passwordHash,
    role: "admin"
  });

  console.log(`Admin created: ${adminEnv.ADMIN_EMAIL}`);
};

seedAdmin()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown seed error";
    console.error(`Admin seed failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
