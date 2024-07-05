const express = require('express');
const router = express.Router();
const controller = require('../../controllers/inspector/index.controller');

router.get('/inspector_surveys', controller.getAllSurveys);
router.get('/inspector_survey/:id', controller.getSurveyById);

module.exports = router;
