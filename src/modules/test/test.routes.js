import express from "express";
import { createTest } from "./test.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { createTestSchema } from "./test.validation.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/",
  validate(createTestSchema),
  asyncHandler(createTest)
);

export default router;