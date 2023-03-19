interface IGetServerSideData<T = any, K = any> {
  results: T | null;
  message: string;
  params?: K;
}
