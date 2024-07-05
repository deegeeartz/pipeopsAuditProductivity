const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/setup', async (req, res) => {
	try {
		const result = await cloudinary.v2.api.create_upload_preset({
			name: 'haudit',
			unsigned: true,
			folder: 'haudit',
			unique_filename: true, // Optional: do not append a unique suffix to the filename
			// allowed_formats: ['jpg', 'png', 'pdf'], // Optional: restrict allowed file formats
		});

		return res.status(200).json({ message: 'Upload preset created!' });
	} catch (error) {
		console.error('Error creating upload preset:', error);
		return res.status(200).json({ message: 'Error creating upload preset!' });
	}
});

router.get('/list', async (req, res) => {
	try {
		const result = await cloudinary.api.resources({ max_results: 1 });
		return res.status(200).json({ result });
	} catch (error) {
		console.error('Error fetching resources:', error);
		return res.status(200).json({ message: 'Error fetching resources!' });
	}
});

router.post('/delete', async (req, res) => {
	const { public_id } = req.body;

	try {
		const result = await cloudinary.v2.uploader.destroy(public_id);
		if (result.result === 'ok') {
			return res.status(200).json({ message: 'File deleted successfully!' });
		} else {
			return res.status(400).json({ error: 'Failed to delete the file!' });
		}
	} catch (error) {
		console.error('Error deleting file:', error);
		return res.status(500).json({ error: 'Something went wrong, please try again later.' });
	}
});

module.exports = router;
