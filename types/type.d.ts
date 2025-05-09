interface FetchDataResponse<T> {
  success: boolean;
  message: string;
  resData: T | null;
}
