import express, { Request, Response } from 'express';
import cors from 'cors';
import prodRoutes from './routes/prodRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/', prodRoutes);

app.get('/', (_: Request, res: Response) => {
	try {
		res.json({ message: 'Welcome to the Product API' });
	} catch (error) {
		console.error('Error:', error);
		res.json({ error: error });
	} finally {
		console.log('Root endpoint request processed');
	}
});

// Test DB connection
import mongoose from "mongoose"
mongoose.connect(process.env.MONGODB_URL || "");


app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});