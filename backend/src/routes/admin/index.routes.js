const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();

const prisma = new PrismaClient();

router.get('/stats', async (req, res) => {
	try {
		// Get counts using Prisma aggregation functions
		const survey = await prisma.survey.count();
		const client = await prisma.client.count();
		const inspector = await prisma.inspector.count();

		// Return counts in the response
		res.status(200).json({ result: { survey, client, inspector } });
	} catch (error) {
		console.error('Error fetching statistics:', error);
		res.status(500).json({ error: 'An error occurred while fetching statistics' });
	}
});

module.exports = router;
