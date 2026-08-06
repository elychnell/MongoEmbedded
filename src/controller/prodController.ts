import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

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
  const todo_id = req.body.todo_id;
  if (content === undefined) {
    res.status(400).json({error: 'Content is required'}) 
    return; 
  }

  try {
    const sql = `
      INSERT INTO products (todo_id, content)
      VALUES (?, ?)
    `;

    const [result] = await db.query<ResultSetHeader>(
        sql,
        [todo_id, content]
    );
    res.status(201).json({message: 'Product created', newProduct: {id: result.insertId, content: content}})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  // const content = req.body.content;
  // const done = req.body.done;
  const {content, done} = req.body // Destructur JS Object
  if (content === undefined || done === undefined) {
    res.status(400).json({error: 'Content and Done are required'})
    return
  }


  try {
    const id = req.params.id
    const [result] = await db.query<ResultSetHeader>(`
        UPDATE products 
        SET content = ?, done = ?
        WHERE id = ?
      `,
      [content, done, id]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json({message: "Product not found"})
      return
    }
  
    res.json({message: 'Product updated'})
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
      res.status(404).json({message: "Product not found"})
      return
    }
    res.json({message: 'Product deleted'})
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}



