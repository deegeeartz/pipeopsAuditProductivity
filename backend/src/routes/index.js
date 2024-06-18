const express = require('express');
const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

router.use('/', userRoutes);
router.use('/', authRoutes);

module.exports = router;
