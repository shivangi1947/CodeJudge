const Problem= require("../models/problem");

exports.getAllProblems = async (req, res) => {
  try 
  {
    const problems = await Problem.find();
    res.status(200).json(problems);       
  } 
  
  catch (err) 
  {
    res.status(500).json({ message: "Something broke!" });
  }
};

exports.getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};





exports.createProblem = async (req, res) => 
{
  try {
    const {
      title,
      statement,
      testCases,
      constraints,
      difficulty,
      tags
    } = req.body;

    if (!title || !statement || !testCases || !constraints || !difficulty) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newProblem = new Problem({
      title,
      statement,
      testCases,
      constraints,
      difficulty,
      tags
    });

    await newProblem.save();

    res.status(201).json(newProblem);
  } 
  
  catch (err) 
  {
    console.log("❌ Error creating problem:", err);
    res.status(500).json({ message: "Failed to create problem", error: err.message });
  }
};

exports.updateProblem = async (req, res) => 
{
    const { id } = req.params;

    try 
    {
    
        const updatedProblem = await Problem.findByIdAndUpdate
        (
            id,
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );
        // Update the fields in the document with whatever the user has sent in the body.


        if (!updatedProblem) 
        {
        return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json(updatedProblem);
    } 

    catch (err) 
    
    {
        res.status(500).json({ message: 'Update failed', error: err.message });
    }

};


exports.deleteProblem = async (req, res) => 
{
  const { id } = req.params;

  try {
    const deleted = await Problem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({ message: 'Problem deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete', error: err.message });
  }
};


