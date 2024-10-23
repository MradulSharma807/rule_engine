// const express = require('express');
// const { createRule, combineRules, evaluateRule } = require('../controllers/ruleController');
// const router = express.Router();

// router.post('/create', createRule);
// router.post('/combine', combineRules);
// router.post('/evaluate', evaluateRule);

// module.exports = router;
const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

// Create a new rule
router.post('/create', ruleController.createRule);

// Combine rules
router.post('/combine', ruleController.combineRules);

// Evaluate a rule
router.post('/evaluate', ruleController.evaluateRule);

module.exports = router;
