const Submission = require('../models/submission');
// const { generateFilePath } = require("../../compiler/generateFilePath");
// const { generateInputFile } = require("../../compiler/generateInputFile");
// const { executecpp } = require("../../compiler/executecpp");
const Problem=require("../models/problem");
const COMPILER_URL=process.env.COMPILER_URL;
const axios = require("axios");

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

    // Input selection logic
    const input = customInput && customInput.trim() !== "" 
      ? customInput 
      : problem.testCases[0].input;

    const expectedOutput = customInput && customInput.trim() !== ""
      ? null // skip comparison for custom input
      : problem.testCases[0].expectedOutput;

    // 🔁 Replace local execution with external compiler call
    
    const compilerResponse = await axios.post(
       process.env.COMPILER_URL+ "/run",
      {
        language,
        code,
        input,
      }
    );

    const output = compilerResponse.data.output.trim();

    let verdict;
    if (expectedOutput === null) {
      verdict = "Executed with Custom Input";
    } else {
      verdict = output === expectedOutput.trim() ? "Accepted" : "Wrong Answer";
    }

    return res.status(200).json({
      verdict,
      output,
      expectedOutput,
    });

  } catch (err) {
    console.error("/run error:", err?.response?.data || err.message);

    return res.status(500).json({
      verdict: "Compilation Error",
      error: err?.response?.data?.error || err.message || "Unknown error"
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

    let verdict = "Accepted";
    let failedCase = null;

    for (let i = 0; i < problem.testCases.length; i++) {
      const { input, expectedOutput } = problem.testCases[i];

      // 🔁 Call remote compiler for each test case
      const compilerResponse = await axios.post(
        process.env.COMPILER_URL + "/run",
        {
          language,
          code,
          input,
        }
      );

      const output = compilerResponse.data.output.trim();
      const expected = expectedOutput.trim();

      if (output !== expected) {
        verdict = "Wrong Answer";
        failedCase = {
          input,
          expectedOutput: expected,
          yourOutput: output,
          caseNumber: i + 1,
        };
        break;
      }
    }

    // Save only if Accepted
    if (verdict === "Accepted") {
      const newSubmission = new Submission({
        problemId,
        userId,
        code,
        language,
        verdict,
      });
      await newSubmission.save();
    }

    return res.status(200).json({
      verdict,
      ...(failedCase ? { failedCase } : {}),
    });

  } catch (err) {
    console.error("Error in handleSubmit:", err?.response?.data || err.message);
    return res.status(500).json({
      error: err?.response?.data?.error || "Something went wrong"
    });
  }
};