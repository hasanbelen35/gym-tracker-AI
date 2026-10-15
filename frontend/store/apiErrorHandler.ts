import { AxiosError } from 'axios';

export interface ApiErrorDetail {
    field?: string;
    message: string;
}

export interface ApiErrorResponse {
    success?: boolean;
    message?: string;
    error?: string;
    details?: ApiErrorDetail[];
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    const err = error as AxiosError<ApiErrorResponse>;
    const data = err?.response?.data as ApiErrorResponse | string | undefined;

    if (typeof data === 'string' && data.trim()) {
        return data;
    }

    if (data && typeof data === 'object') {
        if (Array.isArray(data.details) && data.details.length > 0) {
            const messages = data.details
                .map((detail) => detail?.message)
                .filter(Boolean);
            if (messages.length > 0) return messages.join(', ');
        }

        if (typeof data.message === 'string' && data.message) return data.message;
        if (typeof data.error === 'string' && data.error) return data.error;
    }

    if (typeof err?.message === 'string' && err.message) return err.message;

    return fallback;
};

export const handleApiError = <T = string>(
    error: unknown,
    rejectWithValue: (value: string) => T,
    fallback: string
): T => rejectWithValue(getApiErrorMessage(error, fallback));