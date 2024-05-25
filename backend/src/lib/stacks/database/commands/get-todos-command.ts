import { DynamoDBAdapter } from '../adapters';
import { TodoRecord } from '../records';

interface GetTodosCommandDependencies {
  readonly dynamoDBAdapter: DynamoDBAdapter;
}

export class GetTodosCommand {
  constructor(private readonly dependencies: GetTodosCommandDependencies) {}

  async execute(): Promise<Array<TodoRecord>> {
    const todos = await this.dependencies.dynamoDBAdapter.scan<TodoRecord>();

    return todos;
  }
}
