import { AxiosError } from 'axios';

export interface ApiErrorDetail {
    field: string;
    message: string;
}

export interface ApiErrorResponse {
    success?: boolean;
    message?: string;
    error?: string;
    details?: ApiErrorDetail[];
}
// api error handler
export const handleApiError = (
    error: unknown, 
    rejectWithValue: (value: string) => unknown,
    defaultMessage: string = "Bir hata oluştu."
) => {
    const err = error as AxiosError<ApiErrorResponse>;
    const responseData = err.response?.data;

    if (responseData?.details && responseData.details.length > 0) {
        return rejectWithValue(responseData.details[0].message);
    }

    return rejectWithValue(
        responseData?.error ||
        responseData?.message ||
        defaultMessage
    );
};