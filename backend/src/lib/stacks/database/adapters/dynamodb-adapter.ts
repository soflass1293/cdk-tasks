import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { BaseRecord, KeyRecord } from '../records/base-record';

interface DynamoDBAdapterDependencies {
  readonly db?: DynamoDBDocument;
  readonly tableName: string;
}

export class DynamoDBAdapter {
  private readonly _db: DynamoDBDocument;
  private readonly _tableName: string;

  constructor(dependencies: DynamoDBAdapterDependencies) {
    this._db =
      dependencies.db ||
      DynamoDBDocument.from(new DynamoDBClient({}), {
        marshallOptions: {
          removeUndefinedValues: true,
        },
      });
    this._tableName = dependencies.tableName;
  }

  async putItem<T extends Record<string, any> | undefined>(
    item: T,
  ): Promise<void> {
    await this._db.put({
      TableName: this._tableName,
      Item: item,
    });
    return void 0;
  }

  async scan<T>(): Promise<Array<T>> {
    const { Items } = await this._db.scan({
      TableName: this._tableName,
    });
    return Items as Array<T>;
  }

  async deleteItem<T extends BaseRecord>(Key: KeyRecord<T>): Promise<T> {
    const { Attributes } = await this._db.delete({
      TableName: this._tableName,
      Key,
      ReturnValues: 'ALL_OLD',
    });
    return Attributes as T;
  }

  async getItem<T extends BaseRecord>(
    Key: KeyRecord<T>,
  ): Promise<T | undefined> {
    const { Item } = await this._db.get({
      TableName: this._tableName,
      Key,
    });
    if (Item) {
      return Item as T;
    }
    return undefined;
  }

  async updateItem<T extends Record<string, any> | undefined>(
    item: T,
  ): Promise<void> {
    void this._db.put({
      TableName: this._tableName,
      Item: item,
    });
  }
}
