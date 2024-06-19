const express = require('express');
const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const { auth, onlyAdmin } = require('../middleware/auth.middleware');

router.use('/auth', authRoutes);
router.use('/users', auth, userRoutes);
// router.use('/', auth, onlyAdmin, userRoutes);

module.exports = router;
