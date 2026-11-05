export function unwrap<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export function requireData<T>(data: T | null): T {
  if (data === null) {
    throw new Error("Сервер вернул пустой ответ");
  }

  return data;
}
