import { DateTimeString } from "../../../utils/types";
import { uuid } from "../../../utils/uuid";
import { EventDispatcher } from "../../events/dispatchers/event-dispatcher";
import { TodoDeletedEvent } from "../../events/records";
import { DynamoDBAdapter } from "../adapters";
import { TodoRecord } from "../records";
import { KeyRecord } from "../records/base-record";

interface DeleteTodoCommandDependencies {
  readonly dynamoDBAdapter: DynamoDBAdapter;
  readonly eventDispatcher: EventDispatcher;
}
type DeleteTodoCommandParameters = {
  readonly id: string;
};
export class DeleteTodoCommand {
  constructor(private readonly dependencies: DeleteTodoCommandDependencies) {}

  async execute(parameters: DeleteTodoCommandParameters): Promise<void> {
    const { id } = parameters;

    const todo = await this.dependencies.dynamoDBAdapter.deleteItem<TodoRecord>(
      { id }
    );

    const eventId = uuid();
    const eventTime = new Date().toISOString() as DateTimeString;
    const event: TodoDeletedEvent = {
      eventName: "TODO_DELETED",
      eventId,
      eventTime,
      eventVersion: 1,
      eventData: {
        id,
        name: todo.name,
        completed: todo.completed,
        createdAt: todo.createdAt,
      },
    };
    const { FailedEntryCount } =
    await this.dependencies.eventDispatcher.dispatch([event]);

    if (FailedEntryCount) {
      throw new Error("someething wrong");
    }
  }
}
