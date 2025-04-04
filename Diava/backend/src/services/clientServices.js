const { query } = require("../db");

const getGoals = async () => {
    const { rows } = await query('SELECT * FROM goals');
    return rows;
}

const createGoal = async (goalData) => {
    const { user_id, goal } = goalData;
    const { rows } = await query(
        `INSERT INTO goals (user_id, goal) 
         VALUES ($1, $2) RETURNING *`,
        [user_id, goal]
    );
    
    return rows[0];
};

const updateGoal = async (userID, goalData) => {
    const { rows } = await query(
        'UPDATE goals SET goal = $1 WHERE user_id = $2 RETURNING *',
        [userID, goalData.goal]
    );
    return rows[0]
};
module.exports = {
    getGoals,
    createGoal,
    updateGoal
};