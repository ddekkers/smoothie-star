import { Connection, DeleteResult, Repository } from 'typeorm';
import { ICreateLoggedItemData, LoggedItem } from '../model/LoggedItem';

export class LoggedItemsRepository {
  private ormRepository: Repository<LoggedItem>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(LoggedItem);
  }

  public async getAll(): Promise<LoggedItem[]> {
    const items = await this.ormRepository.find();

    return items;
  }
  public async deleteAll(): Promise<DeleteResult> {
    const result = await this.ormRepository.delete({});
    return result;
  }

  public async create({ name, containsAllergens }: ICreateLoggedItemData): Promise<LoggedItem> {
    console.log("LoggedItemsRepo create")

    const item = this.ormRepository.create({
      name,
      contains_allergens: containsAllergens,
    });
    await this.ormRepository.save(item);

    return item;
  }

  public async getLoggedItemById(id: string): Promise<LoggedItem | null> {
    return await this.ormRepository.findOneBy({id});
  }
  public async getOrCreateLoggedItem(
    name: string,
    containsAllergens: boolean
  ): Promise<LoggedItem> {
    console.log("LoggedItemsRepo")

    const loggedItems = await this.ormRepository.query(`
      SELECT *
      FROM logged_item
      WHERE name = "${name}"
      AND contains_allergens = "${containsAllergens ? 1 : 0}"
    `);
    if (loggedItems.length <= 0) {
      return await this.create({ name, containsAllergens });
    }
    return loggedItems[0];
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.ormRepository.delete(id);
    } catch (e) {
      console.log('error deleting item', e);
    }
  }
}
