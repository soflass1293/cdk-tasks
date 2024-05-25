export type AppSyncError = {
  type: string;
  message: string;
};

export function isAppSyncError(error: unknown): error is AppSyncError {
  return (
    (error as AppSyncError).type !== undefined &&
    (error as AppSyncError).message !== undefined
  );
}
