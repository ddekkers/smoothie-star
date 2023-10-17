import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export interface ICreateLoggedItemData {
  name: string;
  containsAllergens?: boolean;
}

@Entity('logged_item')
export class LoggedItem {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  contains_allergens!: boolean;

  // @ManyToMany((type) => PrintLog, (printLog) => printLog.items)
  // @JoinTable()
  // printLogs: PrintLog;

  // @ManyToMany(() => Allergen)
  // @JoinTable()
  // allergens: Array<Allergen>;
}
