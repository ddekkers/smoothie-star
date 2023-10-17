import { Connection, DeleteResult, Repository } from 'typeorm';
import { PrintLogs } from '../../types';
import { ICreatePrintLogData, PrintLog } from '../model/PrintLog';

export class PrintLogsRepository {
  private ormRepository: Repository<PrintLog>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(PrintLog);
  }

  public async getAll(): Promise<PrintLogs> {
    const items = await this.ormRepository.find({ relations: ['items', 'categories'] });

    return items;
  }
  public async deleteAll(): Promise<DeleteResult> {
    const result = await this.ormRepository.delete({});
    return result;
  }

  public async create({ dateTime, items, categories }: ICreatePrintLogData): Promise<PrintLog> {
    console.log("PrintLogsRepo")
    const newPrintLog = this.ormRepository.create({
      dateTime,
    });
    newPrintLog.items = items;
    newPrintLog.categories = categories;

    const printLog = await this.ormRepository.save(newPrintLog);
    return printLog;
  }
  public async update(printLog: PrintLog, { dateTime, items }: ICreatePrintLogData): Promise<void> {
    await this.ormRepository.update(printLog, {
      dateTime,
      items,
    });
  }

  public async getPrintLogById(id: string): Promise<PrintLog | null> {
    return await this.ormRepository.findOneBy({id});
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.ormRepository.delete(id);
    } catch (e) {
      console.log('error deleting item', e);
    }
  }
}
