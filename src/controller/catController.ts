import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ICatDBResponse } from "../models/ICatDBResponse";

export const fetchAllCats = async (req: Request, res: Response) => {

  try {
    let sql = 'SELECT * FROM categories'
    const [results] = await db.query<RowDataPacket[]>(sql);
    res.json(results)
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const fetchCat = async (req: Request, res: Response) => {
  console.log(req.params)
  const id = req.params.id

  try {
    const [rows] = await db.query<ICatDBResponse[]>(`
        SELECT 
          categories.id AS category_id, 
          categories.name AS category_name,
          products.id AS product_id, 
          products.title AS product_title,
          products.description AS product_description,
          products.stock AS product_stock,
          products.price AS product_price,
          products.image AS product_image,
          products.created_at AS product_created_at
        from product_category
        LEFT JOIN products ON product_category.prodID = products.id
        LEFT JOIN categories ON product_category.catID = categories.id
        WHERE categories.id = ?
      `,
      [id]
    );

    console.log(rows)
    const result = rows[0]
    if (!result) {
      res.status(404).json({message: "Category not found"})
    }
  
    res.json(formatedCategory(rows))
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

const formatedCategory = (rows: ICatDBResponse[]) => {
  if (rows.length !== 0 && rows[0]) { 
  return {
      id:         rows[0].category_id,
      name:    rows[0].category_name,
      products:   rows.map((row) => ({
          id:row.product_id,
          title:row.product_title,
          description:row.product_description,
          stock:row.product_stock,
          price:row.product_price,
          image:row.product_image,
          created_at:row.product_created_at
      }))
    }
  }
}

export const createCat = async (req: Request, res: Response) => {
  const name = req.body.name;
  if (name === undefined) {
    res.status(400).json({error: 'Name is required'}) 
    return; 
  }

  try {
    const sql = `
      INSERT INTO categories (name)
      VALUES (?)
    `;

    const [result] = await db.query<ResultSetHeader>(sql,[name]);
    console.log(result)
    res.status(201).json({message: 'category created', newCategory: {id: result.insertId, name: name}})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


export const updateCat = async (req: Request, res: Response) => {
  const {name} = req.body // Destructur JS Object
  if (name === undefined) {
    res.status(400).json({error: 'Name is required'})
    return
  }


  try {
    const id = req.params.id
    const [result] = await db.query<ResultSetHeader>(`
        UPDATE categories 
        SET name = ?
        WHERE id = ?
      `,
      [name, id]
    );
    
    if (result.affectedRows === 0) {
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
  const id = req.params.id

  try {
    const sql = `
      DELETE FROM categories 
      WHERE id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(sql,[id]);
    if (result.affectedRows === 0) {
      res.status(404).json({message: `Category ${id} not found`})
      return
    }
    res.json({message: `Category ${id} deleted`})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const addCategoryToProduct = async (req: Request, res: Response) => {
  const {id} = req.params
  const {productId} = req.body
  
  try {
    const [result] = await db.query<ResultSetHeader>(`
      INSERT INTO  product_category (catID, prodID)
      VALUES (?, ?)
    `, [id, productId]);

if (!productId) {
    res.status(400).json({ error: 'Product ID is required' });
    return;
  }
    res.json({message: `Category ${id} added to product ${productId}`})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}