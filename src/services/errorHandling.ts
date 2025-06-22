import axios, { AxiosError } from 'axios';

export const formatErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      return `Network error: Cannot connect to server. Please verify that your backend is running on the correct port.`;
    }

    if (axiosError.response?.data) {
      const data = axiosError.response.data as any;
      if (data.message) {
        return Array.isArray(data.message) ? data.message.join('. ') : data.message;
      }
    }

    return `Server error: ${axiosError.response?.statusText || 'Unknown error'} (${axiosError.response?.status})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const logErrorDetails = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.group('API Error Details');
    console.error('Request URL:', axiosError.config?.url);
    console.error('Request Method:', axiosError.config?.method?.toUpperCase());
    console.error('Status:', axiosError.response?.status);
    console.error('Status Text:', axiosError.response?.statusText);
    console.error('Response Data:', axiosError.response?.data);
    console.error('Error Message:', axiosError.message);
    console.groupEnd();
  } else {
    console.error('Non-Axios Error:', error);
  }
};
