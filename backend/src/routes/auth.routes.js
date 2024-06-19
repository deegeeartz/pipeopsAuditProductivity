const express = require('express');
const handlePrismaError = require('../utils/handlePrismaError');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { verifyPassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwtAuth');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
	try {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		});

		const { error, value } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });
		const { email, password } = value;

		// Verify the password
		const user = await prisma.user.findUnique({ where: { email } });
		const passwordMatch = await verifyPassword(password, user?.password ?? '');
		if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password!' });

		delete user.password; // Remove password property
		const token = generateToken({ id: user.id });
		res.status(200).json({ user, message: 'Login successful!', token });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

// ADMIN SETUP
router.get('/setup', async (req, res) => {
	try {
		// Check if an admin already exist
		const existingUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
		if (existingUser) return res.status(403).json({ error: 'Admin has already been created!' });

		// Create record
		const hashPassword = await bcrypt.hash('admin24', 10);
		await prisma.user.create({
			data: {
				name: 'Super Admin',
				email: 'admin@bespoke.com',
				password: hashPassword, // Hash password
				role: 'ADMIN',
			},
		});

		// Return response
		res.status(200).json({ message: 'Admin setup successful!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

module.exports = router;
