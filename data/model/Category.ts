import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ICreateCategoryData {
  name: string;
  color?: string;
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  color!: string;
}
