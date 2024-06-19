const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const handlePrismaError = require('../../utils/handlePrismaError');
const { hashPassword } = require('../../utils/hashPassword');

const prisma = new PrismaClient();
const orderBy = { id: 'desc' };

const service = {
	fetchAllRecords: async () => {
		return await prisma.inspector.findMany({ include: { user: true }, orderBy });
	},
};

const schema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
	name: Joi.string().required(),
	location: Joi.string(),
	language: Joi.string(),
	phoneNumber: Joi.string(),
});

const getAllRecords = async (req, res) => {
	try {
		const { search } = req.query;
		let result;

		if (search) {
			result = await prisma.inspector.findMany({
				where: {
					OR: [{ user: { name: { contains: search } } }, { user: { email: { contains: search } } }],
				},
				include: { user: true },
				orderBy,
			});
		} else {
			result = await service.fetchAllRecords();
			if (!result.length) return res.status(404).json({ error: 'No inspector found!' });
		}

		// Return response
		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred!' });
	}
};

const getRecordById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await prisma.inspector.findUnique({
			where: { id: parseInt(id, 10) },
			include: { user: true },
		});
		if (!result) return res.status(404).json({ error: 'Inspector not found!' });

		res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'An error occurred!' });
	}
};

const createRecord = async (req, res) => {
	try {
		// Validation
		const { error } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { email, password, name, location, language, phoneNumber } = req.body;

		// Check if email is already in use
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) return res.status(409).json({ error: 'Email is already in use' });

		// Create inspector and associated user
		const hashedPassword = await hashPassword(password);
		const result = await prisma.inspector.create({
			data: {
				location,
				language,
				phoneNumber,
				passcode: password,
				user: {
					create: {
						name,
						email,
						password: hashedPassword,
						role: 'INSPECTOR',
					},
				},
			},
			include: { user: true },
		});

		res.status(201).json({ result, message: 'Inspector created successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
};

const updateRecord = async (req, res) => {
	const { id } = req.params;
	try {
		// Validation
		const { error } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { email, password, name, location, language, phoneNumber } = req.body;

		// Find existing inspector
		const inspector = await prisma.inspector.findUnique({
			where: { id: parseInt(id) },
			include: { user: true },
		});
		if (!inspector) return res.status(404).json({ error: 'Inspector not found!' });

		// Check if email is already in use by another user
		if (email && email !== inspector.user.email) {
			const existingUser = await prisma.user.findUnique({ where: { email } });
			if (existingUser) return res.status(409).json({ error: 'Email is already in use' });
		}

		// Update inspector details
		const hashedPassword = await hashPassword(password);
		const updatedInspector = await prisma.inspector.update({
			where: { id: parseInt(id) },
			data: {
				location: location,
				language: language,
				phoneNumber: phoneNumber,
				passcode: password,
				user: {
					update: {
						name: name ?? inspector.user.name,
						email: email ?? inspector.user.email,
						password: password ? hashedPassword : inspector.user.password,
					},
				},
			},
			include: { user: true },
		});

		res.status(200).json({ result: updatedInspector, message: 'Inspector updated successfully!' });
	} catch (error) {
		const prismaError = handlePrismaError(error);
		res.status(prismaError.status).json(prismaError.response);
	}
};

const deleteRecord = async (req, res) => {
	try {
		const { id } = req.params;
		// check if record exists
		const inspector = await prisma.inspector.findUnique({ where: { id: parseInt(id) } });
		if (!inspector) return res.status(404).json({ error: 'Inspector not found!' });

		// Delete user and inspector
		await prisma.inspector.delete({ where: { id: inspector.id } });
		await prisma.user.delete({ where: { id: inspector.userId } });

		// Return response
		res.status(200).json({ message: 'Inspector deleted successfully!' });
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
