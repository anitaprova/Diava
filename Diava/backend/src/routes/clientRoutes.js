const express = require('express');
const clientController = require('../controllers/clientController');
const { updateGoal } = require('../services/clientServices');

const router = express.Router();

router.get('/goals', clientController.getGoals);
router.post('/goals', clientController.createGoal);
router.put('/goals/:id', clientController.updateGoal);

module.exports = router;