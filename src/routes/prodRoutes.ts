import express from 'express';
import { 
  createProduct, 
  deleteProduct, 
  fetchAllProducts, 
  fetchProduct, 
  updateProduct,
  createCat,
  deleteCat,
  updateCat
   } from '../controller/prodController.js';  
const router = express.Router()

router.get('/', fetchAllProducts)
router.get('/:id', fetchProduct)
router.post('/', createProduct)
router.patch('/:id', updateProduct)
router.delete('/:id', deleteProduct)

//EXPANDED CAT
router.post('/:id/categories', createCat);
router.patch('/:id/categories/:catId', updateCat);
router.delete('/:id/categories/:catId', deleteCat);

export default router;