import { RowDataPacket } from "mysql2";

export interface ICatDBResponse extends RowDataPacket {
  product_id: number,
  product_content: string,
  product_created_at: string,
  category_id: number,
  category_name: string
}