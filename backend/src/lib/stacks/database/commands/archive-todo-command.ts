import { DateTimeString } from "../../../utils/types";
import { uuid } from "../../../utils/uuid";
import { EventDispatcher } from "../../events/dispatchers/event-dispatcher";
import { DynamoDBAdapter } from "../adapters";
import { TodoRecord } from "../records";

interface ArchiveTodoCommandDependencies {
  readonly dynamoDBAdapter: DynamoDBAdapter;
}
type ArchiveTodoCommandParameters = {
  readonly id: string;
  readonly name: string;
  readonly createdAt: DateTimeString;
  readonly completed: boolean;
};

export class ArchiveTodoCommand {
  constructor(private readonly dependencies: ArchiveTodoCommandDependencies) {}

  async execute(
    parameters: ArchiveTodoCommandParameters
  ): Promise<void> {
    const { name, completed, createdAt } = parameters;

    const id = uuid();
    const record: TodoRecord = {
      id,
      name,
      completed,
      createdAt,
    };

    await this.dependencies.dynamoDBAdapter.putItem<TodoRecord>(record);
  }
}
