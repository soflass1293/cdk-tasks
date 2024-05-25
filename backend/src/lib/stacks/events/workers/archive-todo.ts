import { EventBridge } from '@aws-sdk/client-eventbridge';
import { DynamoDBAdapter } from '../../database/adapters';
import { ArchiveTodoCommand } from '../../database/commands/archive-todo-command';
import { EventDispatcher } from '../dispatchers/event-dispatcher';
import { TodoVotedEventEventBridgeEvent } from '../records/todo-deleted-event';

const archiveTodoCommand = new ArchiveTodoCommand({
  dynamoDBAdapter: new DynamoDBAdapter({
    tableName: process.env.APP_ARCHIVED_TABLE as string,
  }),
});

export const handler = async (event: TodoVotedEventEventBridgeEvent) => {
  const { detail } = event;
  try {
    await archiveTodoCommand.execute({
      id: detail.eventData.id,
      name: detail.eventData.name,
      createdAt: detail.eventData.createdAt,
      completed: detail.eventData.completed!,
    });
  } catch (error) {
    throw error;
  }
};
