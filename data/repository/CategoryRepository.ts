import { Connection, DeleteResult, Repository } from 'typeorm';
import { ICreateCategoryData, Category } from '../model/Category';

export class CategoryRepository {
  private ormRepository: Repository<Category>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(Category);
  }

  public async getAll(): Promise<Category[]> {
    const categories = await this.ormRepository.find();

    return categories;
  }
  public async deleteAll(): Promise<DeleteResult> {
    const result = await this.ormRepository.delete({});
    return result;
  }

  public async create({ name, color }: ICreateCategoryData): Promise<Category> {
    console.log("create category")
    
    const category = this.ormRepository.create({
      name,
      color,
    });
    console.log("created category")
    await this.ormRepository.save(category);
    console.log("saved category")

    return category;
  }

  public async resetAllAvailabilities(): Promise<void> {
    await this.ormRepository.query(
      `
      UPDATE
        categories
      SET
        is_available = 0
      WHERE
        is_available = 1;
      `
    );
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    return await this.ormRepository.findOneBy({id});
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.ormRepository.delete(id);
    } catch (e) {
      console.log('error deleting category', e);
    }
  }
}
