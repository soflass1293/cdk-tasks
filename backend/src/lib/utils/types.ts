export type Brand<K, T> = K & { __brand: T };
export type DateTimeString = Brand<string, 'DateTimeString'>;