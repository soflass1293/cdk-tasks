import { AppSyncResolverHandler } from "aws-lambda";
import { DynamoDBAdapter } from "../../database/adapters";
import { ToggleCompletedCommand } from "../../database/commands/toggle-completed-command";
import { AppSyncError, isAppSyncError } from "../../database/errors/appsync-error";
import { Mutation, MutationToggleCompletedArgs } from "../types";

const toggleCompletedCommand = new ToggleCompletedCommand({
  dynamoDBAdapter: new DynamoDBAdapter({
    tableName: process.env.APP_TABLE as string,
  }),
});

export const handler: AppSyncResolverHandler<
  MutationToggleCompletedArgs,
  Mutation["toggleCompleted"] | AppSyncError | unknown
> = async (event) => {
  try {
    const { input } = event.arguments;
    const todo = await toggleCompletedCommand.execute({
      id: input.id,
    });
    return todo;
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
