import { ApiError } from "../errors/apiError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!result.success) {
    const formatted = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message
    }));

    return next(new ApiError(400, JSON.stringify(formatted)));
  }

  // overwrite with sanitized data
  req.body = result.data.body;

  next();
};