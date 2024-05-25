import { BaseRecord } from "./base-record";

export type TodoRecord = BaseRecord & {
  readonly name: string;
  readonly completed: boolean;
};
