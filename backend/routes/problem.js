const express = require('express');
const router = express.Router();
const { getAllProblems, getProblemById,createProblem,updateProblem,deleteProblem} = require('../controllers/problem');
//const verifyToken = require('../middleware/verifyToken');

router.get('/', getAllProblems);//done
router.get('/:id', getProblemById);//done
router.post('/',createProblem);//done
router.put('/:id', updateProblem);//done
router.delete('/:id', deleteProblem); //done


module.exports = router;
