import { DateTimeString } from "../../../utils/types";
import { DynamoDBAdapter } from "../adapters";
import { TodoNonExistantError } from "../errors";
import { Todo } from "../models";
import { TodoRecord } from "../records";

interface ToggleCompletedCommandDependencies {
  readonly dynamoDBAdapter: DynamoDBAdapter;
}
type ToggleCompletedCommandParameters = {
  readonly id: string;
};

export class ToggleCompletedCommand {
  constructor(
    private readonly dependencies: ToggleCompletedCommandDependencies
  ) {}

  async execute(
    parameters: ToggleCompletedCommandParameters
  ): Promise<(Todo & { createdAt: DateTimeString }) | undefined> {
    const { id } = parameters;

    const oldTodo = await this.dependencies.dynamoDBAdapter.getItem<TodoRecord>(
      { id }
    );
    if (!oldTodo) {
      throw new TodoNonExistantError();
    }
    const newTodo = {
      ...oldTodo,
      completed: !oldTodo.completed,
    };
    await this.dependencies.dynamoDBAdapter.updateItem<TodoRecord>(newTodo);
    return {
      id: newTodo.id,
      name: newTodo.name,
      completed: newTodo.completed,
      createdAt: newTodo.createdAt,
    };
  }
}
