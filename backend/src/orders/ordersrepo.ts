class Orders {
  static async findAll(): Promise<IFoodGetApi[]> {
    const response = (await pool.query(this.find_foods_query)).rows;

    if (!response) {
      throw new DatabaseError();
    }

    const updatedResponse: IFoodGetApi[] = response.map((item: any) => {
      return this.formatFood(item);
    });
    return updatedResponse;
  }
}
