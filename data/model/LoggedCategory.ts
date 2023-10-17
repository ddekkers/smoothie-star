import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export interface ICreateLoggedCategoryData {
  name: string;
}

@Entity('logged_category')
export class LoggedCategory {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  // @ManyToMany((type) => PrintLog, (printLog) => printLog.categories)
  // @JoinTable()
  // printLogs: PrintLog;
}
