import { Connection, DeleteResult, Repository } from 'typeorm';
import { ICreateLoggedCategoryData, LoggedCategory } from '../model/LoggedCategory';

export class LoggedCategoriesRepository {
  private ormRepository: Repository<LoggedCategory>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(LoggedCategory);
  }

  public async getAll(): Promise<LoggedCategory[]> {
    const categories = await this.ormRepository.find();

    return categories;
  }
  public async deleteAll(): Promise<DeleteResult> {
    const result = await this.ormRepository.delete({});
    return result;
  }

  public async create({ name }: ICreateLoggedCategoryData): Promise<LoggedCategory> {
    console.log("LoggedCategoriesRepo create")

    const category = this.ormRepository.create({
      name,
    });
    await this.ormRepository.save(category);

    return category;
  }

  public async getLoggedCategoryById(id: string): Promise<LoggedCategory | null> {
    return (await this.ormRepository.findOneBy({id}));
  }
  public async getOrCreateLoggedCategory(name: string): Promise<LoggedCategory> {
    const loggedCategories = await this.ormRepository.query(`
      SELECT *
      FROM logged_category
      WHERE name = "${name}"
    `);

    if (loggedCategories.length <= 0) {
    console.log("LoggedCategoriesRepo")

      return await this.create({ name });
    }
    return loggedCategories[0];
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.ormRepository.delete(id);
    } catch (e) {
      console.log('error deleting category', e);
    }
  }
}
