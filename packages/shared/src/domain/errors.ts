/** Failure shapes shared by every data adapter. */
export type AppError =
  | { kind: "network"; message: string }
  | { kind: "http"; status: number; message: string }
  | { kind: "parse"; message: string }
  | { kind: "not-found"; message: string };

/** True for network failures and 5xx responses, which are worth retrying. */
export const isRetryable = (error: AppError): boolean =>
  error.kind === "network" || (error.kind === "http" && error.status >= 500);
