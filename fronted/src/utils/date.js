const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('es-BO', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const dateTimeFormatter = new Intl.DateTimeFormat('es-BO', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

export function formatTime(value) {
  return timeFormatter.format(new Date(value));
}

export function formatDateTime(value) {
  return dateTimeFormatter.format(new Date(value));
}
