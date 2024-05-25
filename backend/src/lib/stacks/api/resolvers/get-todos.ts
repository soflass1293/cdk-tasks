import { AppSyncResolverHandler } from "aws-lambda";
import { DynamoDBAdapter } from "../../database/adapters";
import { AppSyncError, isAppSyncError } from "../../database/errors/appsync-error";
import { GetTodosCommand } from "../../database/commands/get-todos-command";
import { Query } from "../types";

const getTodosCommand = new GetTodosCommand({
  dynamoDBAdapter: new DynamoDBAdapter({
    tableName: process.env.APP_TABLE as string,
  }),
});

export const handler: AppSyncResolverHandler<
  undefined,
  Query["getTodos"] | AppSyncError | unknown
> = async () => {
  try {
    const todos = await getTodosCommand.execute();
    return todos;
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
