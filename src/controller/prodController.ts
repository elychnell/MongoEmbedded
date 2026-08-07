import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const fetchAllProducts = async (req: Request, res: Response) => {
  const search = req.query.search
  const sort = req.query.sort

  try {
    let sql = 'SELECT * FROM products'
    let params: string[] = [];

    if(search) {
      sql += ` WHERE content LIKE ?`
      params = [`%${search}%`]
    }

    // Solution 1
    if(sort && sort === 'asc') {
      sql += ` ORDER BY content ASC`
    } else if (sort && sort === 'desc') {
      sql += ` ORDER BY content DESC`
    }

    const [results] = await db.query<RowDataPacket[]>(sql,params);
    res.json(results)
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const fetchProduct = async (req: Request, res: Response) => {
  console.log(req.params)
  const id = req.params.id

  try {
    const [results] = await db.query<RowDataPacket[]>(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );
    console.log(results, results[0])

    const todo = results[0]
    if (!todo) {
      res.status(404).json({message: "Product not found"})
    }
    res.json(todo)
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const content = req.body.content;
  const product_id = req.body.product_id;
  if (content === undefined) {
    res.status(400).json({error: 'Content is required'}) 
    return; 
  }

  try {
    const sql = `
      INSERT INTO products (product_id, content)
      VALUES (?, ?)
    `;

    const [result] = await db.query<ResultSetHeader>(
        sql,
        [product_id, content]
    );
    res.status(201).json({message: 'Product created', newProduct: {id: result.insertId, content: content}})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const updateProduct = async (req: Request, res: Response) => {
 
  const {content} = req.body // Destructur JS Object
  if (content === undefined) {
    res.status(400).json({error: 'Content is required'})
    return
  }


  try {
    const id = req.params.id
    const [result] = await db.query<ResultSetHeader>(`
        UPDATE products 
        SET content = ?
        WHERE id = ?
      `, [content, id]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json({message: `Product ${id} not found`})
      return
    }
  
    res.json({message: `Product ${id} updated`})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}


export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = `
      DELETE FROM products 
      WHERE id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(sql,[id]);
    if (result.affectedRows === 0) {
      res.status(404).json({message: `Product ${id} not found`})
      return
    }
    res.json({message: `Product ${id} deleted`})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}



