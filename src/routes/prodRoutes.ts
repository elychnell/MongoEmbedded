import express from 'express';
import { 
  createProduct, 
  deleteProduct, 
  fetchAllProducts, 
  fetchProduct, 
  updateProduct,
  addProductToCategory
   } from '../controller/prodController.js';  
const router = express.Router()

router.get('/', fetchAllProducts)
router.get('/:id', fetchProduct)
router.post('/', createProduct)
router.patch('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.post('/productToCat/:id', addProductToCategory)

export default router;