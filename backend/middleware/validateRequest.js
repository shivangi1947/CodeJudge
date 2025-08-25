const validate = (schema) => async (req, res, next) => {
  try {
    // Parse and validate the request body against the provided schema
    await schema.parseAsync(req.body);
    // If validation is successful, proceed to the next middleware (or controller)
    return next();
  } catch (error) {
    // If validation fails, send a 400 Bad Request response with detailed errors
    // Zod provides a structured error object
    return res.status(400).json({
      message: "Invalid request data",
      errors: error.errors,
    });
  }
};

module.exports = { validate };