import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

import { ICatDBResponse, ITodoDBResponse } from "../models/ITodoDBResponse";


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
          categories.content AS category_content,
          categories.created_at AS category_created_at,
          products.id AS product_id, 
          products.category_id AS product_category_id,
          products.content AS product_content,
          products.created_at AS product_created_at
        from categories
        LEFT JOIN products ON categories.id = products.category_id
        LEFT JOIN categories AS categories ON categories.id = categories.id
        WHERE categories.id = ?
      `,
      [id]
    );

    console.log(rows)
    const todo = rows[0]
    if (!todo) {
      res.status(404).json({message: "Category not found"})
    }
  
    res.json(formatedCategory(rows))
  } catch(error: unknown) {
    const message = error  instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: message})
  }
}

const formatedCategory2 = (rows: ITodoDBResponse[]) => {
  if (rows.length !== 0 && rows[0]) { 
  return {
      id:         rows[0].category_id,
      content:    rows[0].category_content,
      done:       rows[0].category_done,
      created_at: rows[0].category_created_at,
      products:   rows.map((row) => ({
          id:row.product_id,
          category_id:row.product_category_id,
          content:row.product_content,
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