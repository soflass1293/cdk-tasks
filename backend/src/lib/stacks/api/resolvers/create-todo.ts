import { AppSyncResolverHandler } from 'aws-lambda';
import { DynamoDBAdapter } from '../../database/adapters';
import { CreateTodoCommand } from '../../database/commands/create-todo-command';
import {
  AppSyncError,
  isAppSyncError,
} from '../../database/errors/appsync-error';
import { Mutation, MutationCreateTodoArgs } from '../types';

const createTodoCommand = new CreateTodoCommand({
  dynamoDBAdapter: new DynamoDBAdapter({
    tableName: process.env.APP_TABLE as string,
  }),
});

export const handler: AppSyncResolverHandler<
MutationCreateTodoArgs,
Mutation['createTodo'] | AppSyncError | unknown
> = async (event) => {
  try {
    const { input } = event.arguments;
    const todo = await createTodoCommand.execute({
      name: input.name,
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
