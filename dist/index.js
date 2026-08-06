"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
//import carRoutes from './routes/carRoutes.js';
//import { connectToDatabase } from './config/db.js';
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//app.use('/cars', carRoutes);
app.get('/', (_, res) => {
    try {
        res.send('Hello, World! (response)');
    }
    catch (error) {
        console.error('Error:', error);
        res.json({ error: error });
    }
    finally {
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
//# sourceMappingURL=index.js.map