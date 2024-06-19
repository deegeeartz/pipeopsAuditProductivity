const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.auth = async (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization) return res.status(401).json({ error: 'No Authorization Header!' });
	try {
		const token = authorization.split('Bearer ')[1];
		if (!token) return res.status(401).json({ error: 'Unauthorized request!' });

		// Get current user
		const decode = jwt.verify(token, process.env.SECRET_KEY);
		const user = await prisma.user.findUnique({ where: { id: parseInt(decode.id) } });

		req.user = user;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ error: 'Token Expired! Please login again.', errorObject: error });
		}
		return res.status(401).json({ error: 'Invalid Token!', errorObject: error });
	}
};

exports.onlyAdmin = async (req, res, next) => {
	if (req.user.role === 'ADMIN') {
		next();
	}
	return res.status(403).send('Unauthorized access. Admins only!');
};
