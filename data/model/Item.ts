import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ICreateItemData {
  name: string;
  imageUri?: string;
  color?: string;
  isAvailable?: boolean;
  containsAllergens?: boolean;
  allergens?: Array<string>;
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  image_uri: string;

  @Column()
  color: string;

  @Column()
  is_available: boolean;

  @Column()
  contains_allergens: boolean;

  @Column()
  price_category: number

  // @ManyToMany(() => Allergen)
  // @JoinTable()
  // allergens: Array<Allergen>;
}
