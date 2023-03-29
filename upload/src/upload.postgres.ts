import { pool } from "../redifood-module/src/definitions/pool.pg";
import { IUploadPictureDB } from "../redifood-module/src/interfaces";

class Upload {
  static async createUpload(queryString: string): Promise<{ created: boolean }> {
    const query = await pool.query(queryString);
    return { created: true };
  }

  static async getAllActivatedPictures(): Promise<IUploadPictureDB[]> {
    const res = await pool.query(`SELECT * FROM food_picture WHERE photo_activated is TRUE`).rows;
    return res;
  }

  static async deletePictures(item_id: number): Promise<{ deleted: boolean }> {
    const res = await pool.query(`DELETE FROM food_picture WHERE item_id = $1`, [item_id]);
    return { deleted: true };
  }
}
