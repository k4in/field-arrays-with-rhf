import axios, { type Method, type ResponseType } from 'axios';

interface GetDataParams {
  url: string;
  params?: Record<string, string | number | undefined>;
  responseType?: ResponseType;
  timeout?: number;
  withCredentials?: boolean;
}

interface MutateDataParams {
  url: string;
  method: Method;
  params?: Record<string, string | number | undefined>;
  data?: Record<string, unknown>;
  responseType?: ResponseType;
  timeout?: number;
  withCredentials?: boolean;
}

export async function getData<T>(options: GetDataParams): Promise<T> {
  const result = await axios.get<T>(options.url, {
    params: options.params,
    responseType: options.responseType,
    timeout: options.timeout || 5000,
    withCredentials: options.withCredentials,
  });
  return result.data;
}

export async function mutateData<T>(options: MutateDataParams): Promise<T> {
  const result = await axios(options.url, {
    method: options.method,
    params: options.params,
    data: options.data,
    responseType: options.responseType,
    timeout: options.timeout || 5000,
    withCredentials: options.withCredentials,
  });
  return result.data;
}
