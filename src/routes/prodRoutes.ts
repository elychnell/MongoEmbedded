import express from 'express';
import { 
  createProduct, 
  deleteProduct, 
  fetchAllProducts, 
  fetchProduct, 
  updateProduct } from '../controller/prodController.js';  
const router = express.Router()

router.get('/products', fetchAllProducts)
router.get('/products/:id', fetchProduct)
router.post('/products', createProduct)
router.patch('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

export default router;