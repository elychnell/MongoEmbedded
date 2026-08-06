import express from 'express';
import { 
  createProduct, 
  deleteProduct, 
  fetchProduct, 
  updateProduct } from '../controller/prodController.js';  
const router = express.Router()

// router.get('/', fetchAllSubtasks)
router.get('/:id', fetchProduct)
router.post('/:variable', createProduct)
router.patch('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router;