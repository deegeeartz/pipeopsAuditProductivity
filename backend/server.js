const express = require('express');
const app = express();
require('dotenv').config();

// Base url
app.get('/', (req, res) => res.json([]));

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});