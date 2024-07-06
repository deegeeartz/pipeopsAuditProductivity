const { PrismaClient } = require('@prisma/client');
const handlePrismaError = require('../../utils/handlePrismaError');

const prisma = new PrismaClient();
const orderBy = { id: 'desc' };

const getAllSurveys = async (req, res) => {
	try {
		const { search } = req.query;
		let result;
		const include = {
			audits: { select: { id: true, inspectorId: true } },
			_count: {
				select: { questions: true, audits: true },
			},
		};

		if (search) {
			result = await prisma.survey.findMany({
				where: {
					OR: [{ clientName: { contains: search } }, { hotelName: { contains: search } }],
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

const getSurveyById = async (req, res) => {
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
};

module.exports = {
	getAllSurveys,
	getSurveyById,
};
