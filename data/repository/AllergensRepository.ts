import { Connection, Repository } from 'typeorm';
import { Allergen, ICreateAllergenData } from '../model/Allergen';

export class AllergensRepository {
  private ormRepository: Repository<Allergen>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(Allergen);
  }

  public async getAll(): Promise<Allergen[]> {
    const Allergens = await this.ormRepository.find();

    return Allergens;
  }

  public async create({ name }: ICreateAllergenData): Promise<Allergen> {
    const Allergen = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(Allergen);

    return Allergen;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
