export type FetchDataProps = {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any; // could be object or FormData
  token?: string;
  isAuthenticationRequired?: boolean;
  headers?: Record<string, any>;
  endpoint:string
};

export type FetchDataResponse<T = any> = {
  data: T | null;
  statusCode: number | null;
  error?: string;
};

export const fetchDataFunc = async <T = any>({
  url,
  method = 'GET',
  body = null,
  token,
  isAuthenticationRequired = false,
  headers = {},
  endpoint
}: FetchDataProps): Promise<FetchDataResponse<T>> => {
  try {
    const requestHeaders: HeadersInit = {
      ...headers,
    };

    const isFormData = body instanceof FormData;

    if (!isFormData) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (isAuthenticationRequired && token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url+endpoint, {
      method,
      headers: requestHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : null,
    });

    const statusCode = response.status;
    const data = await response.json();

    return {
      data,
      statusCode,
    };
  } catch (error: any) {
    return {
      data: null,
      statusCode: null,
      error: error?.message || 'Something went wrong',
    };
  }
};

