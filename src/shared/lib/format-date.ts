const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit"
});

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}
