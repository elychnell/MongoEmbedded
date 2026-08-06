import express from 'express';
import { 
  createCat,
  deleteCat,
  fetchAllCats,
  fetchCat,
  updateCat } from '../controller/catController';
const router = express.Router()

router.get('/categories', fetchAllCats)
router.post('/categories', createCat)
router.patch('/categories/:id', updateCat)
router.delete('/categories/:id', deleteCat)
router.get('/categories/:id/products', fetchCat)

export default router;
