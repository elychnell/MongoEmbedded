import Express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import catRoutes from './routes/catRoutes.js';
//import { connectToDatabase } from './config/db.js';

const app = Express();
const PORT = 3000;

app.use(Express.json());
app.use(cors());
app.use('/', catRoutes);

app.get('/', (_: Request, res: Response) => {
	try {
		res.send('Hello, World! (response)');
	} catch (error) {
		console.error('Error:', error);
		res.json({ error: error });
	} finally {
		console.log('Root endpoint request processed');
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Test DB connection
//connectToDatabase();

// ... some query

// Close the pool

//await db.end(); // NEEDED?
