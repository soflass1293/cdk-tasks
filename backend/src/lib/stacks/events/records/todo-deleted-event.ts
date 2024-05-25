import { EventBridgeEvent } from 'aws-lambda';
import { BaseEvent } from './base-event';
import { Todo } from '../../api/types';

export type TodoDeletedEvent = BaseEvent & {
  readonly eventName: 'TODO_DELETED';
  readonly eventVersion: 1;
  readonly eventData: {
    id: Todo['id'];
    name: Todo['name'];
    completed: Todo['completed'];
    createdAt: Todo['createdAt'];
  };
};

export type TodoVotedEventEventBridgeEvent = EventBridgeEvent<TodoDeletedEvent['eventName'], TodoDeletedEvent>;
