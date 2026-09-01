import { Request, Response } from "express";
import  product from "../models/product";

export const fetchAllProducts = async (req: Request, res: Response) => {
  const search = req.query.search as string;
  const sort = req.query.sort as string;

  try {
  const filter: any = {};

  if (search) {
  filter.title = { $regex: search, $options: 'i' };
  }

let query = product.find(filter);

  if(sort && sort === 'asc') {
      query = query.sort({price: 1})
  } else if (sort && sort === 'desc') {
      query = query.sort({price: -1})
  }

 const result = await query;

    res.json(result)
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const fetchProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const result = await product.findById(id);

    if (!result) {
      res.status(404).json({message: "Product not found"})
      return  
    }
    res.json(result)
  } catch(error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const {title, description, stock, price} = req.body as {title: string, description: string, stock: number, price: number};

  if (title === undefined) {
    res.status(400).json({error: 'Title is required'}) 
    return; 
  }

  if (description === undefined) {
    res.status(400).json({error: 'Description is required'}) 
    return; 
  }

  if (stock === undefined) {
    res.status(400).json({error: 'Stock is required'}) 
    return; 
  }

  if (price === undefined) {
    res.status(400).json({error: 'Price is required'}) 
    return; 
  }

  try {
    const result = await product.create({title, description, stock, price});
    res.status(201).json({message: 'Product created', newProduct: {id: result._id, title: title, description: description, stock: stock, price: price}})

  } catch (error: unknown) {
    console.error('SERVER ERROR IN CREATEPRODUCT:', error);
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const updateProduct = async (req: Request, res: Response) => {
const id = req.params.id as string;
const {title, description, stock, price} = req.body as {title: string, description: string, stock: number, price: number};
const updateData: any = {};

  if (title !== undefined) {
    updateData.title = title;
  }
  if (description !== undefined) {
    updateData.description = description;
  }
  if (stock !== undefined) {
    updateData.stock = stock;
  }
  if (price !== undefined) {
    updateData.price = price;
  }


 if (title === undefined && description === undefined && stock === undefined && price === undefined) {
    res.status(400).json({error: 'At least one field is required'}) 
    return; 
  }

  try {
    
    const result = await product.findByIdAndUpdate(id, updateData, {returnDocument: 'after'});
    
    if (!result) {
      res.status(404).json({message: `Product ${id} not found`})
      return;
    }
  
    res.json({message: `Product ${id} updated`})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const result = await product.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({message: `Product ${id} not found`})
      return
    }
    res.json({message: `Product ${id} deleted`})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

//EXPANDED CAT

export const createCat = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const name = req.body.name as string;

  if (!name) {
    res.status(400).json({error: 'Name is required'}) 
    return; 
  }

  try {
    const result = await product.findByIdAndUpdate(id,
      {
        $push: {
          categories: {
            name: name
          }
        }
      },
      { new: true }
    );

     if (!result) {
      res.status(404).json({message: `Product ${id} not found`});
      return;
    }

    res.status(201).json({message: 'category created', newCategory: {ProductId: id, name: name}})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


export const updateCat = async (req: Request, res: Response) => {
  const name = req.body.name as string;
  const id = req.params.id as string;
  const catId = req.params.catId as string;

  if (!name) {
    res.status(400).json({error: 'Name is required'})
    return
  }

  try {
    
    const result = await product.findByIdAndUpdate(id,
  {
    $set: {
      categories: {
        _id: catId,
        name: name
      }
    }
  },
  { new: true }
);
  
    if (!result) {
      res.status(404).json({message: "Category not found"})
      return
    }
    res.json({message: `Category ${id} updated`})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const deleteCat = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const catId = req.params.catId as string;

  try {
    const result = await product.findByIdAndUpdate(id,
  {
    $pull: {
      categories: {
        _id: catId
      }
    }
  },
  { new: true }
);

    if (!result) {
      res.status(404).json({message: `Category ${id} not found`})
      return
    }
    res.json({message: `Category ${id} deleted`})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}