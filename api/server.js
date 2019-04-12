const express = require('express');

const db = require('../data/dbConfig.js');

const server = express();

server.use(express.json());

module.exports = server;

// server setup done

server.get('/', (req, res) => {
	res.send('Server Running!!');
});

// Get
server.get('/games', async (req, res) => {
	try {
		const response = await db('games');
		res.status(200).json([...response]);
	} catch (e) {
		res.status(500).json({ error: 'An error has occuried.' });
	}
});
server.get('/games/:id', async (req, res) => {
	try {
		const game = await db('games').where(req.body.params, '=', 'games.id');
		game
			? res.status(200).json(game)
			: res.status(404).json({ message: 'Not found.' });
	} catch (e) {
		res.status(500).json({ error: 'An error has occuried.' });
	}
});

// post
server.post('/games', async (req, res) => {
	const { title, genre, releaseYear } = req.body;
	if (!title || !genre) {
		res.status(422).json({
			message:
				'Please provide the require information of title, genre, and release year.'
		});
	}
	try {
		const getTitle = await db('games').select('title');
		const look = getTitle.includes(title);
		if (look) {
			res.status(405).json({
				message:
					'Not Allowed - This title already exists in the database, please try again with a new title.'
			});
		}
		const response = await db('games').insert({ title, genre, releaseYear });
		res.status(201).json(response);
	} catch (e) {
		res.status(500).json({
			error: 'An error occuried while attempting to post to the database.'
		});
	}
});
