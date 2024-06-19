const express = require('express');
const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const { auth, onlyAdmin } = require('../middleware/auth.middleware');
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./admin/category.routes');
const inspectorRoutes = require('./admin/inspector.routes');
const clientRoutes = require('./admin/client.routes');
const surveyRoutes = require('./admin/survey.routes');
const auditRoutes = require('./audit.routes');
const adminRoutes = require('./admin/index.routes');

router.use('/auth', authRoutes);
router.use('/category', auth, categoryRoutes);
router.use('/client', auth, clientRoutes);
router.use('/inspector', auth, inspectorRoutes);
router.use('/survey', auth, surveyRoutes);
router.use('/audit', auth, auditRoutes);

router.use('/admin', auth, adminRoutes);

module.exports = router;
