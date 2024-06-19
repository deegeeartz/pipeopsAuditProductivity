const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const handlePrismaError = require('../utils/handlePrismaError');

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
	surveyId: Joi.number().required(),
	// inspectorId: Joi.number().required(),
});

const getAllRecords = async (req, res) => {
	try {
		const { search } = req.query;
		const include = { inspector: true, survey: true };
		let result;

		if (search) {
			result = await prisma.audit.findMany({
				where: {
					OR: [
						{ survey: { clientName: { contains: search } } },
						{ survey: { hotelName: { contains: search } } },
					],
				},
				include,
				orderBy,
			});
		} else {
			result = await prisma.audit.findMany({ include, orderBy });
			if (!result.length) return res.status(404).json({ error: 'No audit found!' });
		}

		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred!' });
	}
};

const getInspectorAudits = async (req, res) => {
	try {
		const { search } = req.query;
		const userId = parseInt(req.user.id);
		const include = { inspector: true, survey: true };
		let result;

		if (search) {
			result = await prisma.audit.findMany({
				where: {
					inspector: { userId },
					OR: [
						{ survey: { clientName: { contains: search } } },
						{ survey: { hotelName: { contains: search } } },
					],
				},
				include,
				orderBy,
			});
		} else {
			result = await prisma.audit.findMany({ where: { inspector: { userId } }, include, orderBy });
			if (!result.length) return res.status(404).json({ error: 'No audit found for this user!' });
		}

		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred!' });
	}
};

const getClientAudits = async (req, res) => {
	try {
		const { search } = req.query;
		const userId = parseInt(req.user.id);
		const include = { survey: true };
		let result;

		if (search) {
			result = await prisma.audit.findMany({
				where: {
					survey: { client: { userId } },
					OR: [
						{ survey: { hotelName: { contains: search } } },
						{ survey: { campaign: { contains: search } } },
					],
				},
				include,
				orderBy,
			});
		} else {
			result = await prisma.audit.findMany({
				where: { survey: { client: { userId } } },
				include,
				orderBy,
			});
			if (!result.length) return res.status(404).json({ error: 'No audit found for this user!' });
		}

		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred!' });
	}
};

const getSurveyAudits = async (req, res) => {
	try {
		const { id: surveyId } = req.params;

		const result = await prisma.audit.findMany({
			where: { surveyId: parseInt(surveyId) },
			select: {
				id: true,
				status: true,
				createdAt: true,
				inspector: {
					select: { user: { select: { name: true } } },
				},
			},
			orderBy,
		});

		// Format result
		const formattedResult = result.map((audit) => ({
			id: audit.id,
			status: audit.status,
			createdAt: new Date(audit.createdAt).toDateString(),
			inspectorName: audit?.inspector?.user?.name,
		}));
		res.status(200).json({ result: formattedResult });
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred!' });
	}
};

const addFeedback = async (req, res) => {
	try {
		const { id: auditId } = req.params;
		const { feedback } = req.body;

		const audit = await prisma.audit.update({
			where: { id: parseInt(auditId) },
			data: { feedback },
		});

		if (!audit) return res.status(404).json({ error: 'Audit not found!' });
		res.status(200).json({ message: 'Feedback updated successfully!', audit });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
};

const getRecordById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await prisma.audit.findUnique({
			where: { id: parseInt(id) },
			include: {
				inspector: true,
				survey: {
					include: { questions: { include: { category: true } } },
				},
				responses: true,
			},
		});

		if (!result) return res.status(404).json({ error: 'Audit not found!' });

		// Group questions by category
		const categories = {};
		result.survey.questions.forEach((question) => {
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
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred while fetching the audit record' });
	}
};

const createRecord = async (req, res) => {
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
		} = value;

		// Validate inspector existence
		const userId = parseInt(req.user.id);
		const inspector = await prisma.inspector.findUnique({ where: { userId } });
		if (!inspector) return res.status(404).json({ error: 'Inspector not found!' });

		const result = await prisma.audit.create({
			data: {
				expense,
				brandStandard,
				detailedSummary,
				executiveSummary,
				scenario,
				status,
				inspectorId: inspector.id,
				surveyId,
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

		res.status(201).json({ result, message: 'Audit created successfully!' });
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

		const {
			expense,
			brandStandard,
			detailedSummary,
			executiveSummary,
			scenario,
			status,
			surveyId,
			responses,
		} = value;

		const result = await prisma.audit.update({
			where: { id: parseInt(id) },
			data: {
				expense,
				brandStandard,
				detailedSummary,
				executiveSummary,
				scenario,
				status,
				surveyId,
				responses: {
					deleteMany: { auditId: parseInt(id) },
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

		res.status(200).json({ result, message: 'Audit updated successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
};

const deleteRecord = async (req, res) => {
	try {
		const { id } = req.params;
		const auditId = parseInt(id);

		const existingAudit = await prisma.audit.findUnique({ where: { id: auditId } });
		if (!existingAudit) return res.status(404).json({ error: 'Audit not found!' });

		await prisma.response.deleteMany({ where: { auditId } });
		await prisma.audit.delete({ where: { id: auditId } });

		res.status(200).json({ message: 'Audit deleted successfully!' });
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
	getInspectorAudits,
	getSurveyAudits,
	getClientAudits,
	addFeedback,
};
