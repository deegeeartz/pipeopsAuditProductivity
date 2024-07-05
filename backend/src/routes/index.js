const express = require('express');
const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const { auth, onlyAdmin } = require('../middleware/auth.middleware');
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./admin/category.routes');
const inspector = require('./admin/inspector.routes');
const clientRoutes = require('./admin/client.routes');
const surveyRoutes = require('./admin/survey.routes');
const adminRoutes = require('./admin/index.routes');

const auditRoutes = require('./audit.routes');
const inspectorDashboard = require('./inspector/index.routes');
const cloudinaryRoutes = require('./cloudinary.routes');
const customerRoutes = require('./customer/index.routes');

// Protected routes
router.use('/auth', authRoutes);
router.use('/category', auth, onlyAdmin, categoryRoutes);
router.use('/client', auth, onlyAdmin, clientRoutes);
router.use('/inspector', auth, onlyAdmin, inspector);
router.use('/survey', auth, onlyAdmin, surveyRoutes);
router.use('/admin', auth, adminRoutes);

router.use('/audit', auth, auditRoutes);
router.use('/cloudinary', auth, cloudinaryRoutes);
router.use('/inspector_survey', auth, inspectorDashboard);

// Public routes
router.use('/customer', customerRoutes);

module.exports = router;
