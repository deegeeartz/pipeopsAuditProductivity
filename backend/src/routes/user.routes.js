const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const handlePrismaError = require('../utils/handlePrismaError');

const router = express.Router();
const prisma = new PrismaClient();

// CLIENTS
router.get('/clients', async (req, res) => {
	try {
		const result = await prisma.client.findMany({
			include: {
				user: true, // Include the associated user details
			},
		});

		if (result.length === 0) {
			return res.status(404).json({ message: 'No clients found' });
		}
		// Return response
		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching clients:', error);
		res.status(500).json({ error: 'An error occurred' });
	}
});

router.post('/clients', async (req, res) => {
	try {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
			name: Joi.string(),
			hotelName: Joi.string().required(),
			location: Joi.string(),
			additionalNotes: Joi.string(),
		});

		const { error } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { name, email, password, hotelName, location, additionalNotes } = req.body;

		// Check if the email is already in use
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) return res.status(409).json({ error: 'Email address is already in use' });

		// Create record
		const hashPassword = await bcrypt.hash(password, 10);
		const result = await prisma.client.create({
			data: {
				hotelName: hotelName,
				location: location,
				additionalNotes: additionalNotes,
				passcode: password,
				user: {
					create: {
						name: name,
						email: email,
						password: hashPassword, // Hash password
						role: 'CLIENT',
					},
				},
			},
			include: {
				user: true, // Include the associated user details in the response
			},
		});

		// Return response
		res.status(200).json({ result, message: 'Client created successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

// INSPECTORS

router.get('/inspectors', async (req, res) => {
	try {
		const result = await prisma.inspector.findMany({
			include: {
				user: true, // Include the associated user details
			},
		});

		if (result.length === 0) {
			return res.status(404).json({ message: 'No inspectors found' });
		}
		// Return response
		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching inspectors:', error);
		res.status(500).json({ error: 'An error occurred' });
	}
});

router.post('/inspectors', async (req, res) => {
	try {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
			name: Joi.string(),

			location: Joi.string(),
			language: Joi.string(),
			phoneNumber: Joi.string(),
		});

		const { error } = schema.validate(req.body);
		const { name, email, password, location, language, phoneNumber } = req.body;
		if (error) return res.status(400).json({ error: error.details[0].message });

		// Check if the email is already in use
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) return res.status(409).json({ error: 'Email address is already in use' });

		// Create record
		const hashPassword = await bcrypt.hash(password, 10);
		const result = await prisma.inspector.create({
			data: {
				location: location,
				language: language,
				phoneNumber: phoneNumber,
				passcode: password,
				user: {
					create: {
						name: name,
						email: email,
						password: hashPassword, // Hash password
						role: 'INSPECTOR',
					},
				},
			},
			include: {
				user: true, // Include the associated user details in the response
			},
		});

		// Return response
		res.status(200).json({ result, message: 'Inspector created successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

module.exports = router;
