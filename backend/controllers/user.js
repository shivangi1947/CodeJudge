const User = require('../models/user');
const Submission = require('../models/submission');
const Problem = require('../models/problem');

exports.getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Get basic user info (remains the same)
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Get solved counts AND total problem counts in parallel 🚀
        const [solvedStats, totalProblemCounts, calendarData] = await Promise.all([
            // AGGREGATION 1: Get user's solved problems grouped by difficulty
            Submission.aggregate([
                { $match: { userId: user._id, verdict: 'Accepted' } },
                { $group: { _id: "$problemId" } }, // Get unique solved problem IDs
                {
                    $lookup: { // Join with the problems collection to get difficulty
                        from: 'problems',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'problemDetails'
                    }
                },
                { $unwind: '$problemDetails' },
                { $group: { _id: "$problemDetails.difficulty", count: { $sum: 1 } } }
            ]),
            // AGGREGATION 2: Get total problems grouped by difficulty
            Problem.aggregate([
                { $group: { _id: "$difficulty", count: { $sum: 1 } } }
            ]),
            // AGGREGATION 3: Get submission calendar data
            Submission.aggregate([
                { $match: { userId: user._id } },
                { $project: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
                { $group: { _id: "$date", count: { $sum: 1 } } }
            ])
        ]);

        // 3. Format the results from the aggregations
        const solvedByDifficulty = {
            Easy: solvedStats.find(d => d._id === 'Easy')?.count || 0,
            Medium: solvedStats.find(d => d._id === 'Medium')?.count || 0,
            Hard: solvedStats.find(d => d._id === 'Hard')?.count || 0,
        };
        
        const totalProblemsByDifficulty = {
            Easy: totalProblemCounts.find(d => d._id === 'Easy')?.count || 0,
            Medium: totalProblemCounts.find(d => d._id === 'Medium')?.count || 0,
            Hard: totalProblemCounts.find(d => d._id === 'Hard')?.count || 0,
        };
        
        const submissionCalendar = calendarData.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        // 4. Send the complete stats object
        res.status(200).json({
            user,
            stats: {
                totalSolved: solvedByDifficulty.Easy + solvedByDifficulty.Medium + solvedByDifficulty.Hard,
                solvedByDifficulty,
                totalProblemsByDifficulty,
                submissionCalendar
            }
        });

    } catch (err) {
        console.error("Error fetching user stats:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// This function is correct, just ensure it's protected by admin middleware in your routes.
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};