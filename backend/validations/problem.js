const { z } = require('zod');

// This schema defines the shape of the data for creating a new problem
const createProblemSchema = z.object({
  title: z.string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters long")
    .trim(),

  statement: z.string({ required_error: "Problem statement is required" })
    .min(20, "Problem statement must be at least 20 characters long"),

  difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
    errorMap: () => ({ message: "Difficulty must be 'Easy', 'Medium', or 'Hard'" })
  }),

  tags: z.array(z.string())
    .min(1, "At least one tag is required"),

  constraints: z.string({ required_error: "Constraints are required" })
    .min(5, "Constraints must be at least 5 characters long"),

  // For C++ only setup
  boilerplate: z.string({ required_error: "Boilerplate code is required" })
    .min(10, "Boilerplate code is too short"),

  testCases: z.array(
    z.object({
      input: z.string({ required_error: "Test case input is required" }),
      expectedOutput: z.string({ required_error: "Test case output is required" }),
      isHidden: z.boolean().optional().default(false)
    })
  ).min(1, "At least one test case is required"),

  timeLimit: z.number({ required_error: "Time limit is required" })
    .positive("Time limit must be a positive number"),

  memoryLimit: z.number({ required_error: "Memory limit is required" })
    .positive("Memory limit must be a positive number"),
});

module.exports = { createProblemSchema };