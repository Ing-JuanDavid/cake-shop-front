export interface Response<T> {
  ok: boolean,
  data: T,
  error: string | null;
}
