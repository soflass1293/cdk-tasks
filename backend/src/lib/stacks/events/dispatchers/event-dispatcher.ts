import {
  EventBridge,
  PutEventsCommandOutput,
} from '@aws-sdk/client-eventbridge';
import { BaseEvent } from '../records';


export interface IEventDispatcherDependencies {
  readonly client: EventBridge;
  readonly eventBusName: string;
}

interface IDispatchResult extends PutEventsCommandOutput {
  FailedEvents: BaseEvent[];
}

export class EventDispatcher {
  private readonly _client: EventBridge;
  private readonly _eventBusName: string;

  public constructor(dependencies: IEventDispatcherDependencies) {
    this._client = dependencies.client;
    this._eventBusName = dependencies.eventBusName;
  }

  public async dispatch(events: BaseEvent[]): Promise<IDispatchResult> {
    const response = await this._client.putEvents({
      Entries: events.map((event) => ({
        Source: 'com.soflass.cdk.todos',
        EventBusName: this._eventBusName,
        Detail: JSON.stringify(event),
        DetailType: event.eventName,
      })),
    });
    const FailedEvents: BaseEvent[] = [];
    if (response.FailedEntryCount) {
      // @ts-ignore
      response.Entries?.forEach((entry) => {
        if (!entry.EventId) {
          FailedEvents.push(entry as BaseEvent);
        }
      });
    }
    return {
      ...response,
      FailedEvents,
    };
  }
}
