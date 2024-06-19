const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const handlePrismaError = require('../../utils/handlePrismaError');
const router = express.Router();

const prisma = new PrismaClient();
const orderBy = { id: 'desc' };

router.get('/', async (req, res) => {
	try {
		const { search } = req.query;
		let result;

		if (search) {
			result = await prisma.category.findMany({ where: { title: { contains: search } }, orderBy });
		} else {
			result = await prisma.category.findMany({ orderBy });
			if (!result.length) return res.status(404).json({ error: 'No category found!' });
		}

		// Return response
		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred!' });
	}
});

router.post('/', async (req, res) => {
	try {
		// Validation
		const schema = Joi.object({ title: Joi.string().required() });
		const { error } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		// Create record
		const { title } = req.body;
		const category = await prisma.category.create({ data: { title } });

		if (category) {
			const result = await prisma.category.findMany({ orderBy });
			res.status(200).json({ result, message: 'Category added successfully!' });
		}
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

router.put('/:id', async (req, res) => {
	try {
		// Validation
		const schema = Joi.object({ title: Joi.string().required() });
		const { error } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		// Check if record exists
		const { id } = req.params;
		let category = await prisma.category.findUnique({ where: { id: parseInt(id) } });
		if (!category) return res.status(404).json({ error: 'Category not found!' });

		// Create record
		const { title } = req.body;
		category = await prisma.category.update({ where: { id: parseInt(id) }, data: { title } });

		if (category) {
			const result = await prisma.category.findMany({ orderBy });
			res.status(200).json({ result, message: 'Category updated successfully!' });
		}
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		// check if record exists
		const { id } = req.params;
		const category = await prisma.category.findUnique({ where: { id: parseInt(id) } });
		if (!category) return res.status(404).json({ error: 'Category not found!' });

		// Delete the event
		await prisma.category.delete({ where: { id: parseInt(id) } });
		const result = await prisma.category.findMany({ orderBy });

		// Return response
		res.status(200).json({ result, message: 'Category deleted successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

module.exports = router;
