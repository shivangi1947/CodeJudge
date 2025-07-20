const Submission = require('../models/submission');
const { generateFilePath } = require("../../compiler/generateFilePath");
const { generateInputFile } = require("../../compiler/generateInputFile");
const { executecpp } = require("../../compiler/executecpp");
const Problem=require("../models/problem");

exports.getSubByUser = async (req, res) => 
{
  const { userId } = req.params;

  try 
  {
    const submissions = await Submission.find({ userId }).populate('problemId', 'title');
    res.status(200).json(submissions);

  } 
  
  catch (error) 
  {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

exports.getSubByProblem = async (req, res) => 
{
  const { userId, problemId } = req.params;

  try 
  {
    const submissions = await Submission.find({ userId, problemId }).sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } 
  
  catch (error) 
  
  {
    res.status(500).json({ error: 'Failed to fetch submissions for this problem' });
  }
};



exports.runCode = async (req, res) => {
  const { language, code, problemId, input: customInput } = req.body;

  try {
    const problem = await Problem.findById(problemId); // prob nikalo

    if (!problem || problem.testCases.length === 0) {
      return res.status(404).json({ error: "Problem or test case not found" });
    }

    // abhi ke liye ek hi test case rakhte hain
    const input = customInput && customInput.trim() !== "" 
      ? customInput 
      : problem.testCases[0].input;

    const expectedOutput = customInput && customInput.trim() !== ""
      ? null // we don't compare for custom input
      : problem.testCases[0].expectedOutput;

    const codeFilePath = await generateFilePath(language, code); // code nikalo
    const inputFilePath = await generateInputFile(input); // input file banao

    const output = (await executecpp(codeFilePath, inputFilePath)).trim(); // output aa gya

    let verdict;
    if (expectedOutput === null) {
      verdict = "Executed with Custom Input"; // custom case
    } else {
      verdict = output === expectedOutput.trim() ? "Accepted" : "Wrong Answer";
    }

    return res.status(200).json({
      verdict,
      output,
      expectedOutput
    });

  } catch (err) {
    console.error(" /run error:", err);
    return res.status(500).json({
      verdict: "Compilation Error",
      error: err.stderr || err.message || "Unknown error"
    });
  }
};



exports.submitCode = async (req, res) => {
  const { problemId, userId, code, language } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem || problem.testCases.length === 0) {
      return res.status(404).json({ error: "Problem or test cases not found" });
    }

    const codeFilePath = await generateFilePath(language, code);

    let verdict = 'Accepted';
    let failedCase = null;

    for (let i = 0; i < problem.testCases.length; i++) {
      const { input, expectedOutput } = problem.testCases[i];
      const inputFilePath = await generateInputFile(input);

      const rawOutput = await executecpp(codeFilePath, inputFilePath);
      const output = rawOutput.trim();
      const expected = expectedOutput.trim();

      if (output !== expected) {
        verdict = 'Wrong Answer';
        failedCase = {
          input,
          expectedOutput: expected,
          yourOutput: output,
          caseNumber: i + 1
        };
        break; // Stop on first failed test case
      }
    }

    // Save only if Accepted
    if (verdict === 'Accepted') {
      const newSubmission = new Submission({
        problemId,
        userId,
        code,
        language,
        verdict
      });
      await newSubmission.save();
    }

    return res.status(200).json({
      verdict,
      ...(failedCase ? { failedCase } : {}) // if wrong, send failing case
    });

  } catch (err) {
    console.error("Error in handleSubmit:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
