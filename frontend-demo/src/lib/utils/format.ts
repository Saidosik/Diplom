export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} мин`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (rest === 0) return `${hours} ч`;
  return `${hours} ч ${rest} мин`;
}

export function formatRelativeTime(isoString: string) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
