import app from "./app.js";
import { config } from "./config/index.js";
import { connectDB } from "./infrastructure/database/mongo.js";
import { logger } from "./common/utils/logger.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
};

startServer();