const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const handlePrismaError = require('../../utils/handlePrismaError');
const { hashPassword } = require('../../utils/hashPassword');

const prisma = new PrismaClient();
const orderBy = { id: 'desc' };

const schema = Joi.object({
	clientId: Joi.number().required(),
	clientName: Joi.string().allow(''),
	hotelName: Joi.string().allow(''),
	campaign: Joi.string().allow(''),
	location: Joi.string().allow(''),
	startDate: Joi.string().allow(''),
	endDate: Joi.string().allow(''),
	questions: Joi.array(),
});

const getAllRecords = async (req, res) => {
	try {
		const { search } = req.query;
		let result;
		const include = { _count: { select: { questions: true } } };

		if (search) {
			result = await prisma.survey.findMany({
				where: {
					OR: [
						{ clientName: { contains: search } },
						{ hotelName: { contains: search } },
						{ campaign: { contains: search } },
					],
				},
				include,
				orderBy,
			});
		} else {
			result = await prisma.survey.findMany({ include, orderBy });
			if (!result.length) return res.status(404).json({ error: 'No survey found!' });
		}

		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred!' });
	}
};

const getRecordById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await prisma.survey.findUnique({
			where: { id: parseInt(id) },
			include: { questions: true },
		});
		if (!result) return res.status(404).json({ error: 'Survey not found!' });

		res.status(200).json({ result });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
};

const createRecord = async (req, res) => {
	try {
		// Validation
		const { error, value } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { clientId, clientName, hotelName, campaign, location, startDate, endDate, questions } = value;

		// Create record
		const result = await prisma.survey.create({
			data: {
				hotelName,
				campaign,
				location,
				startDate: startDate ? new Date(startDate) : null,
				endDate: endDate ? new Date(endDate) : null,
				clientName,
				clientId,
				questions: {
					create: questions.map((question) => ({
						type: question.type,
						text: question.text,
						options: question.options ? JSON.stringify(question.options) : null,
						categoryId: question.categoryId,
					})),
				},
			},
		});

		res.status(201).json({ result, message: 'Survey created successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
};

const updateRecord = async (req, res) => {
	try {
		const { id } = req.params;
		const { error, value } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { clientId, clientName, hotelName, campaign, location, startDate, endDate, questions } = value;

		// Check if record exists
		const existingSurvey = await prisma.survey.findUnique({ where: { id: parseInt(id) } });
		if (!existingSurvey) return res.status(404).json({ error: 'Survey not found!' });

		// Update survey
		const result = await prisma.survey.update({
			where: { id: parseInt(id) },
			data: {
				hotelName,
				campaign,
				location,
				startDate: startDate ? new Date(startDate) : null,
				endDate: endDate ? new Date(endDate) : null,
				clientName,
				clientId,
				questions: {
					deleteMany: {}, // Remove existing questions
					create: questions.map((question) => ({
						type: question.type,
						text: question.text,
						options: question.options ? JSON.stringify(question.options) : null,
						categoryId: question.categoryId,
					})),
				},
			},
		});

		res.status(200).json({ result, message: 'Survey updated successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
};

const deleteRecord = async (req, res) => {
	try {
		const { id } = req.params;
		const surveyId = parseInt(id);

		const existingSurvey = await prisma.survey.findUnique({ where: { id: surveyId } });
		if (!existingSurvey) return res.status(404).json({ error: 'Survey not found!' });

		// Delete survey and all associated questions
		await prisma.question.deleteMany({ where: { surveyId } });
		await prisma.survey.delete({ where: { id: surveyId } });

		res.status(200).json({ message: 'Survey deleted successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
};

module.exports = {
	getAllRecords,
	getRecordById,
	createRecord,
	updateRecord,
	deleteRecord,
};
