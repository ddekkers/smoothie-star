import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ICreateItemData, Item } from '../model/Item';

export class ItemsRepository {
  private ormRepository: Repository<Item>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(Item);
  }

  public async getAll(): Promise<Item[]> {
    const items = await this.ormRepository.find();

    return items;
  }
  public async deleteAll(): Promise<DeleteResult> {
    const result = await this.ormRepository.delete({});
    return result;
  }

  public async create({
    name,
    imageUri,
    color,
    isAvailable,
    containsAllergens,
  }: ICreateItemData): Promise<Item> {

    const item = this.ormRepository.create({
      name,
      image_uri: imageUri,
      color,
      is_available: isAvailable,
      contains_allergens: containsAllergens,
      price_category: 0
    });
    await this.ormRepository.save(item);

    return item;
  }

  public async resetAllAvailabilities(): Promise<void> {
    await this.ormRepository.query(
      `
      UPDATE
        items
      SET
        is_available = 0
      WHERE
        is_available = 1;
      `
    );
  }

  public async getItemById(id: string): Promise<Item | null> {
    return await this.ormRepository.findOneBy({id});
  }

  public async toggleItemAvailability(id: string): Promise<Item | null> {
    const item = await this.ormRepository.findOneBy({id});
    if (item) {
      item.is_available = !item.is_available;
      await this.ormRepository.save(item);
    }
    return item;
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.ormRepository.delete(id);
    } catch (e) {
      console.log('error deleting item', e);
    }
  }
}
