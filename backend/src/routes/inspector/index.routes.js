const express = require('express');
const router = express.Router();
const controller = require('../../controllers/inspector/index.controller');

router.get('/', controller.getAllSurveys);
router.get('/:id', controller.getSurveyById);

module.exports = router;
