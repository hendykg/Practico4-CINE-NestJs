export function getSeatRowLabel(rowNumber) {
  return String.fromCharCode(64 + rowNumber);
}

export function formatSeat(seat) {
  return `Fila ${getSeatRowLabel(seat.fila)}, Butaca ${seat.columna}`;
}

export function formatSeatCompact(seat) {
  return `${getSeatRowLabel(seat.fila)}${seat.columna}`;
}
