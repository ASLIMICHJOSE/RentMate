/** Shape of every successful API response returned by the RentMate server. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Shape of every failed API response returned by the RentMate server. */
export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/** Standard list metadata used by paginated endpoints. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
