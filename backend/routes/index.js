const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();

const prisma = new PrismaClient();

router.get('/users', async (req, res) => {
	try {
		const allUsers = await prisma.user.findMany();
		console.log(allUsers);

		if (allUsers.length) {
			res.send({ result: allUsers });
		} else {
			res.send({ result: allUsers, message: 'No users found' });
		}
	} catch (error) {
		res.status(500).json({ error: 'An error occurred' });
	}
});

router.post('/users', async (req, res) => {
	try {
		const user = await prisma.user.create({
			data: {
				name: 'Dave',
				email: 'dave@test.com',
			},
		});

		// Return response
		res.send({ result: user, message: 'User created successfully!' });
	} catch (error) {
		res.status(500).json({ error: 'An error occurred' });
	}
});

module.exports = router;
