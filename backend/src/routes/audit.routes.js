const express = require('express');
const router = express.Router();
const controller = require('../controllers/audit.controller');
const { inspectorOnly } = require('../middleware/auth.middleware');

router.get('/', controller.getAllRecords);

router.get('/inspector', inspectorOnly, controller.getInspectorAudits);

router.get('/:id', controller.getRecordById);

router.post('/', inspectorOnly, controller.createRecord);

router.put('/:id', controller.updateRecord);

router.delete('/:id', controller.deleteRecord);

module.exports = router;
