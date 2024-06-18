const express = require('express');
const app = express();
require('dotenv').config();

const Routes = require('./src/routes/index');

// Routes
app.use('/api', Routes);
app.get('/', (req, res) => res.json([]));

// Listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`App running on port: ${PORT}`);
});
