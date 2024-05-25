import { DateTimeString } from '../../../utils/types';

export type BaseRecord = {
  readonly id: string;
  readonly createdAt: DateTimeString;
};

export type KeyRecord<R extends BaseRecord> = Pick<R, 'id'>;
