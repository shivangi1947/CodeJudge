const express = require('express');
const router = express.Router();

// Controllers
const { 
  getAllProblems, 
  getProblemById, 
  createProblem, 
  updateProblem, 
  deleteProblem 
} = require('../controllers/problem');

// Middlewares
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const { validate } = require('../middleware/validateRequest');

// Validation Schemas
const { createProblemSchema } = require('../validations/problem');

// GET all problems (Public)
router.get('/', getAllProblems);

// GET a single problem by ID (Public)
router.get('/:id', getProblemById);

// POST a new problem (Admin only, with validation)
router.post(
  '/', 
  verifyToken, 
  verifyAdmin, 
  validate(createProblemSchema), // ✨ Validation middleware is added here
  createProblem
);

// PUT to update a problem (Admin only)
router.put('/:id', verifyToken, verifyAdmin, updateProblem);

// DELETE a problem (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, deleteProblem);

module.exports = router;