import express from 'express';
import { 
  addCategoryToProduct,
  createCat,
  deleteCat,
  fetchAllCats,
  fetchCat,
  updateCat } from '../controller/catController';
const router = express.Router()

router.get('/', fetchAllCats);
router.post('/', createCat);
router.patch('/:id', updateCat);
router.delete('/:id', deleteCat);
router.get('/:id/products', fetchCat);
router.post('/catToProduct/:id', addCategoryToProduct);

export default router;
