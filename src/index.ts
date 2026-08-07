import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import catRoutes from './routes/catRoutes.js';
import prodRoutes from './routes/prodRoutes.js';
//import { connectToDatabase } from './config/db.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/', catRoutes);
app.use('/products', prodRoutes);

app.get('/', (_: Request, res: Response) => {
	try {
		res.send(`<style>pre { display: inline;position: relative; right: 50px; } </style>
			<h2>API Routes</h2>
		<h4>Categories:</h4>
		<pre>
		• Hämta alla kategorier med GET: <a href="http://localhost:3000/categories">http://localhost:3000/categories</a>
		• Hämta alla produkter tillhörande en viss kategori med GET: <a href="http://localhost:3000/categories/:id/products">http://localhost:3000/categories/:id/products</a>
		• Skapa ny kategori med POST: <a href="http://localhost:3000/categories">http://localhost:3000/categories</a>
		• Uppdatera befintlig kategori med PATCH: <a href="http://localhost:3000/categories/:id">http://localhost:3000/categories/:id</a>
		• Radera befintlig kategori med DELETE: <a href="http://localhost:3000/categories/:id">http://localhost:3000/categories/:id</a>
		</pre>
		<h4>Products:</h4>
		<pre>
		• Hämta alla produkter med GET: <a href="http://localhost:3000/products">http://localhost:3000/products</a>
		* Skall kunna söka produkter efter produkt titel
		* Skall kunna sortera produktlistan efter pris, både (asc/desc)<br/>
		• Hämta enskild produkt med GET: <a href="http://localhost:3000/products/:id">http://localhost:3000/products/:id</a>
		• Skapa ny produkt med POST: <a href="http://localhost:3000/products">http://localhost:3000/products</a>
		• Uppdatera befintlig produkt med PATCH: <a href="http://localhost:3000/products/:id">http://localhost:3000/products/:id</a>
		• Radera befintlig produkt med DELETE: <a href="http://localhost:3000/products/:id">http://localhost:3000/products/:id</a>
		</pre>`);
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
