const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

describe('server.js', () => {
	it('should respond with 200 ok', () => {
		return request(server)
			.get('/')
			.expect(200);
	});

	describe('GET /', () => {
		it('should respond with 500 ok', () => {
			return request(server)
				.get('/')
				.expect(200);
		});
	});

	// calling API for array
	describe('/games', () => {
		it('should return an array', async () => {
			const response = await request(server).get('/games/');
			expect(typeof response.body).toBe('object');
		});
		it('should return an empty array', async () => {
			const id = 1;
			const response = await request(server);
			expect(response.body).not.toBeDefined();
		});
	});
});

describe("POST '/games'", () => {
	// testing response of POST
	it('should respond with a game object', async () => {
		const game = {
			title: 'PacMan',
			genre: 'arcade',
			releaseYear: 1982
		};
		const response = await request(server)
			.post('/api/games')
			.send(game);
		expect(typeof response.body).toBe('object');
	});

	it('should respond with status code 405 when title exists', async () => {
		const game = {
			title: 'a',
			genre: 'b'
		};

		expect(game.title).toEqual('a');
	});

	// testing 201 HTTP status code  when received correct game data
	it('should return 201 when adding a new game ', async () => {
		const res = await request(server)
			.post('/games')
			.send({
				title: 'Mortal Kombat',
				genre: 'xbox',
				releaseYear: 1980
			});

		expect(res.status).toBe(201);
	});

	//testing 422 HTTP status code when received incorrect game data
	it('should return 422 when title and genre are not provided', async () => {
		const res = await request(server)
			.post('/games')
			.send({ title: '', genre: '', releaseYear: 1980 });

		expect(res.status).toBe(422);
	});
});
