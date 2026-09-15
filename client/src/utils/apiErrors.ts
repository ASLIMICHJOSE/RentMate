import { ApiRequestError } from '../services/http';

export interface ApiFieldError {
  field: string;
  message: string;
}

function isFieldErrorList(details: unknown): details is ApiFieldError[] {
  return (
    Array.isArray(details) &&
    details.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'field' in item &&
        'message' in item &&
        typeof (item as ApiFieldError).field === 'string' &&
        typeof (item as ApiFieldError).message === 'string',
    )
  );
}

/**
 * Extracts `{ field: message }` pairs from a `VALIDATION_ERROR` response so
 * forms can show server-side messages on the matching inputs.
 *
 * The server validates everything again, so these messages are the ones that
 * actually decided the outcome; the client checks are only a fast first pass.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiRequestError) || error.code !== 'VALIDATION_ERROR') {
    return {};
  }

  if (!isFieldErrorList(error.details)) {
    return {};
  }

  return error.details.reduce<Record<string, string>>((accumulator, detail) => {
    accumulator[detail.field] = detail.message;
    return accumulator;
  }, {});
}

/** Message to show in a toast for any thrown request error. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
