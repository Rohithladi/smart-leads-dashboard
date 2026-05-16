import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { apiRouter } from "./routes/index.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const publicDirectory = path.resolve(currentDirectory, "../public");
const indexHtmlPath = path.join(publicDirectory, "index.html");

export const createApp = (): express.Express => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.use("/api/v1", apiRouter);

  if (env.NODE_ENV === "production" && fs.existsSync(indexHtmlPath)) {
    app.use(express.static(publicDirectory));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) {
        return next();
      }

      return res.sendFile(indexHtmlPath);
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
