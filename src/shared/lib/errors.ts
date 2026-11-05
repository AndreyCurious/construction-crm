const messages: Record<string, string> = {
  FORBIDDEN: "Недостаточно прав для этого действия.",
  TASK_NOT_FOUND: "Задача не найдена или недоступна.",
  OBJECT_NOT_FOUND: "Объект удалён или недоступен. Обновите страницу.",
  STALE_RECORD: "Данные уже изменились. Обновите страницу и повторите действие.",
  OBJECT_NOT_EMPTY: "Сначала удалите или перенесите все задачи этого объекта.",
  INVALID_ASSIGNEE: "Назначить задачу можно только исполнителю.",
  INVALID_TRANSITION: "Этот переход статуса недоступен. Обновите страницу.",
  COMMENT_REQUIRED: "Укажите причину возврата на доработку.",
  COMMENT_TOO_LONG: "Комментарий не должен превышать 2000 символов.",
  "Invalid login credentials": "Неверный email или пароль.",
  "Email not confirmed": "Email ещё не подтверждён. Обратитесь к администратору.",
  "Failed to fetch": "Нет соединения с сервером. Проверьте подключение.",
  "fetch failed": "Нет соединения с сервером. Проверьте подключение.",
  "Email rate limit exceeded": "Слишком много попыток входа. Попробуйте позже."
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    for (const [code, message] of Object.entries(messages)) {
      if (error.message.includes(code)) {
        return message;
      }
    }
  }

  return "Не удалось выполнить действие. Попробуйте ещё раз.";
}
