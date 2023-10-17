import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LoggedCategory } from './LoggedCategory';
import { LoggedItem } from './LoggedItem';

export interface ICreatePrintLogData {
  items: Array<LoggedItem>;
  categories: Array<LoggedCategory>;
  dateTime: number;
  containsAllergens?: boolean;
}

@Entity('print_log')
export class PrintLog {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToMany(() => LoggedItem)
  @JoinTable()
  items!: LoggedItem[];

  @Column()
  dateTime!: number;

  @ManyToMany(() => LoggedCategory)
  @JoinTable()
  categories!: LoggedCategory[];
}
