import { DateTimeString } from "../../../utils/types";
import { uuid } from "../../../utils/uuid";
import { DynamoDBAdapter } from "../adapters";
import { Todo } from "../models";
import { TodoRecord } from "../records";

interface CreateTodoCommandDependencies {
  readonly dynamoDBAdapter: DynamoDBAdapter;
}
type CreateTodoCommandParameters = {
  readonly name: string;
};

export class CreateTodoCommand {
  constructor(private readonly dependencies: CreateTodoCommandDependencies) {}

  async execute(
    parameters: CreateTodoCommandParameters
  ): Promise<Todo & { createdAt: DateTimeString }> {
    const { name } = parameters;

    const id = uuid();
    const createdAt = new Date().toISOString() as DateTimeString;
    const record: TodoRecord = {
      id,
      name,
      completed: false,
      createdAt,
    };

    await this.dependencies.dynamoDBAdapter.putItem<TodoRecord>(record);

    return {
      id: record.id,
      name: record.name,
      completed: record.completed,
      createdAt: record.createdAt,
    };
  }
}
