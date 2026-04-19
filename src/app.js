import express from "express";
import helmet from "helmet";
import cors from "cors";

import { httpLogger } from "./common/utils/logger.js";
import { errorHandler } from "./common/middleware/error.middleware.js";
import testRoutes from "./modules/test/test.routes.js";

const app = express();

// core middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// logging
app.use(httpLogger);

// health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use("/api/test", testRoutes);

// error handler (last)
app.use(errorHandler);

export default app;