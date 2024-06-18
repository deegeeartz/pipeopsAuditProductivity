const express = require('express');
const handlePrismaError = require('../utils/handlePrismaError');
const Joi = require('joi');
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
		if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password.' });

		console.log(user);
		const token = generateToken(user);
		res.status(200).json({ user, message: 'Login successful!', token });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

module.exports = router;
