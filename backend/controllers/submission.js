const Submission = require('../models/submission');

exports.getSubByUser = async (req, res) => 
{
    const { userId } = req.params;

    try 
    {
        const submissions = await Submission.find({ userId })
        .populate('problemId', 'title') 
        .sort({ createdAt: -1 });

        res.status(200).json(submissions);
    } 
    
    catch (err) 
    {
        res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
    }
};

exports.getSubByProblem = async (req, res) => 
{
  const { problemId } = req.params;

  try 
  {
      const submissions = await Submission.find({ problemId })
      .populate('userId', 'username') 
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } 
  
  catch (err) 
  
  {
    res.status(500).json({ message: 'Failed to fetch problem submissions', error: err.message });
  }
};



