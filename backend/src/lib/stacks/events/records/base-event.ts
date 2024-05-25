import { DateTimeString } from "../../../utils/types";

export interface BaseEvent {
  readonly eventId: string;
  readonly eventName: string;
  readonly eventVersion: number;
  readonly eventTime: DateTimeString;
  readonly eventData: Record<string, unknown>;
}
