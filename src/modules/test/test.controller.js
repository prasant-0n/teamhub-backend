import { ApiResponse } from "../../common/utils/apiResponse.js";

export const createTest = async (req, res) => {
  return res.status(201).json(
    new ApiResponse(201, req.body, "Validated successfully")
  );
};