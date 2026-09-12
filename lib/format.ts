export function formatDatePtBr(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(date);
}

export function formatWorkload(hours: number): string {
  if (hours === 1) {
    return "1 hora";
  }
  return `${hours} horas`;
}

export function formatSeatsLabel(count: number): string {
  if (count === 1) {
    return "1 vaga restante";
  }
  return `${count} vagas restantes`;
}

export function readSafePath(value: string | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}
