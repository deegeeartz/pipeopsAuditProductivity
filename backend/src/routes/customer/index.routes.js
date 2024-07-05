const express = require('express');
const { PrismaClient } = require('@prisma/client');
const handlePrismaError = require('../../utils/handlePrismaError');
const Joi = require('joi');

const router = express.Router();
const prisma = new PrismaClient();
const orderBy = { id: 'desc' };

const schema = Joi.object({
	expense: Joi.string().allow(''),
	brandStandard: Joi.string().allow(''),
	detailedSummary: Joi.string().allow(''),
	executiveSummary: Joi.string().allow(''),
	scenario: Joi.string().allow(''),
	status: Joi.string().allow(''),
	responses: Joi.array(),
	uploads: Joi.object(),
	surveyId: Joi.number().required(),
});

router.get('/survey/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await prisma.survey.findUnique({
			where: { id: parseInt(id) },
			include: {
				questions: { include: { category: true } },
			},
		});
		if (!result) return res.status(404).json({ error: 'Survey not found!' });

		// Group questions by category
		const categories = {};
		result.questions.forEach((question) => {
			const category = question.category;
			if (!categories[category.id]) {
				categories[category.id] = {
					id: category.id,
					title: category.title,
					questions: [],
				};
			}
			categories[category.id].questions.push(question);
		});

		res.status(200).json({ result: { ...result, categories: Object.values(categories) } });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

router.post('/audit', async (req, res) => {
	try {
		const { error, value } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const {
			expense,
			brandStandard,
			detailedSummary,
			executiveSummary,
			scenario,
			status,
			surveyId,
			responses,
			uploads,
		} = value;

		const result = await prisma.audit.create({
			data: {
				expense,
				brandStandard,
				detailedSummary,
				executiveSummary,
				scenario,
				status,
				surveyId,
				uploads,
				responses: {
					create: responses.map((response) => ({
						answer: response.answer,
						optionAnswer: response.optionAnswer,
						files: response.files ?? [],
						skip: response.skip,
						questionId: response.questionId,
					})),
				},
			},
		});

		res.status(201).json({ result, message: 'Audit saved successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
});

module.exports = router;
