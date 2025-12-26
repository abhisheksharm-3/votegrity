/**
 * Shared API response types and utility types for consistent error handling
 */

export type ApiSuccessResponseType<T> = {
    success: true;
    data: T;
    message?: string;
};

export type ApiErrorResponseType = {
    success: false;
    error: string;
    code?: string;
};

export type ApiResponseType<T> = ApiSuccessResponseType<T> | ApiErrorResponseType;

export type PaginatedResponseType<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
};
