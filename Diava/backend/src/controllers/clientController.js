const clientService = require("../services/clientServices");

const getGoals = async (req, res) => {
    try {
        const goals = await clientService.getGoals();
        res.status(200).json(goals);  // Fixed the variable name from 'clients' to 'goals'
    } catch (err) { 
        console.error('Error fetching goals:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createGoal = async (req, res) => {
    try {
        const goalData = req.body;
        const newGoal = await clientService.createGoal(goalData);  // Fixed from 'newClient' to 'newGoal'
        res.status(200).json(newGoal);
    } catch (err) { 
        console.error('Error adding goal:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateGoal = async (req,res) => {
    try {
        const userID = req.params.id 
        const goalData = req.body
        const updateGoal = await clientService.updateGoal(userID, goalData);
        if(!updateGoal) {
            return res.status(404).json({message: 'User not found'});

        }
        res.status(200).json(updateGoal);

    } catch(err) {
        console.error('Error updating user goal: ', err)
        res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = {
    getGoals,
    createGoal,
    updateGoal
};