import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export interface ICreateAllergenData {
  name: string;
}
@Entity('allergen')
export class Allergen {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
