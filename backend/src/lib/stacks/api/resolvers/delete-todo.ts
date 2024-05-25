import { EventBridge } from "@aws-sdk/client-eventbridge";
import { AppSyncResolverHandler } from "aws-lambda";
import { DynamoDBAdapter } from "../../database/adapters";
import { DeleteTodoCommand } from "../../database/commands/delete-todo-command";
import { AppSyncError, isAppSyncError } from "../../database/errors/appsync-error";
import { EventDispatcher } from "../../events/dispatchers/event-dispatcher";
import {
  Mutation, MutationDeleteTodoArgs
} from "../types";

const deleteTodoCommand = new DeleteTodoCommand({
  dynamoDBAdapter: new DynamoDBAdapter({
    tableName: process.env.APP_TABLE as string,
  }),
  eventDispatcher: new EventDispatcher({
    eventBusName: 'default',
    client: new EventBridge({}),
  }),
});

export const handler: AppSyncResolverHandler<
  MutationDeleteTodoArgs,
  Mutation["deleteTodo"] | AppSyncError | unknown
> = async (event) => {
  try {
    const { input } = event.arguments;
    await deleteTodoCommand.execute({
      id: input.id,
    });
    return true;
  } catch (error: unknown) {
    if (isAppSyncError(error)) {
      return {
        error: {
          message: error.message,
          type: error.type,
        },
      };
    }
    return error;
  }
};
