require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorHandlerMiddleware from "./middleware/error";
import ErrorHandler from "./utils/ErrorHandler";
import path from "path";

import { refreshAccessTokenMiddleware } from "./services/refresh.service";

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "./uploads")));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://147.182.237.161:5173",
      "http://localhost:9098",
      "http://localhost:9097",
      "http://localhost:9053",
      "http://147.182.237.161:9012/"
    ],
    credentials: true,
  })
);

//routers
import userRoutes from "./routes/user.routes";
import destinationRoutes from "./routes/destinations.routes";
import experienceRoutes from "./routes/experiences.routes";
import hiddengemRoutes from "./routes/hiddengems.routes";
import bookingRoutes from "./routes/bookings.routes";

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: "api is working" });
});

//refresh user access token
app.use(refreshAccessTokenMiddleware);

//routes
app.use(
  "/api/v1",
  userRoutes,
  destinationRoutes,
  experienceRoutes,
  hiddengemRoutes,
  bookingRoutes
);

//unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorHandler(`Route ${req.originalUrl} not found`, 400);
  next(err);
});

app.use(ErrorHandlerMiddleware);
