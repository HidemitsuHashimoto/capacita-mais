import { buildSlug } from "@/lib/format";

export type CourseFormInput = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  workloadHours: number;
  isFree: boolean;
  priceLabel: string;
  isAccessible: boolean;
  targetAudience: string;
  maxSeats: number;
  listedSeatsRemaining: number;
  isDemo: boolean;
};

export type LessonFormInput = {
  title: string;
  body: string;
  videoUrl: string | null;
  sortOrder: number;
  durationMinutes: number;
};

export function readTrimmedField(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function readIntegerField(
  formData: FormData,
  key: string,
): number | null {
  const raw = readTrimmedField(formData, key);
  if (!raw) {
    return null;
  }
  const value = Number(raw);
  if (!Number.isInteger(value)) {
    return null;
  }
  return value;
}

export function parseCourseForm(
  formData: FormData,
): CourseFormInput | string {
  const title = readTrimmedField(formData, "title");
  const slugSource =
    readTrimmedField(formData, "slug") || title;
  const slug = buildSlug(slugSource);
  const summary = readTrimmedField(formData, "summary");
  const description = readTrimmedField(formData, "description");
  const targetAudience = readTrimmedField(formData, "targetAudience");
  const isFree = formData.get("isFree") === "on";
  const priceLabel =
    readTrimmedField(formData, "priceLabel") || (isFree ? "Gratuito" : "");
  const workloadHours = readIntegerField(formData, "workloadHours");
  const maxSeats = readIntegerField(formData, "maxSeats");
  const listedSeatsRemaining = readIntegerField(
    formData,
    "listedSeatsRemaining",
  );
  if (!title) {
    return "Informe o título do curso.";
  }
  if (!slug) {
    return "Informe um endereço (slug) válido.";
  }
  if (!summary) {
    return "Informe o resumo.";
  }
  if (!description) {
    return "Informe a descrição.";
  }
  if (!targetAudience) {
    return "Informe o público-alvo.";
  }
  if (!priceLabel) {
    return "Informe o rótulo de preço.";
  }
  if (workloadHours === null || workloadHours < 1) {
    return "A carga horária deve ser um número inteiro maior que zero.";
  }
  if (maxSeats === null || maxSeats < 0) {
    return "O número de vagas totais deve ser um inteiro maior ou igual a zero.";
  }
  if (listedSeatsRemaining === null || listedSeatsRemaining < 0) {
    return "As vagas restantes devem ser um inteiro maior ou igual a zero.";
  }
  if (listedSeatsRemaining > maxSeats) {
    return "As vagas restantes não podem ser maiores que as vagas totais.";
  }
  return {
    slug,
    title,
    summary,
    description,
    workloadHours,
    isFree,
    priceLabel,
    isAccessible: formData.get("isAccessible") === "on",
    targetAudience,
    maxSeats,
    listedSeatsRemaining,
    isDemo: formData.get("isDemo") === "on",
  };
}

export function parseLessonForm(
  formData: FormData,
): LessonFormInput | string {
  const title = readTrimmedField(formData, "title");
  const body = readTrimmedField(formData, "body");
  const videoRaw = readTrimmedField(formData, "videoUrl");
  const sortOrder = readIntegerField(formData, "sortOrder");
  const durationMinutes = readIntegerField(formData, "durationMinutes");
  if (!title) {
    return "Informe o título da aula.";
  }
  if (!body) {
    return "Informe o conteúdo da aula.";
  }
  if (sortOrder === null || sortOrder < 1) {
    return "A ordem deve ser um número inteiro maior que zero.";
  }
  if (durationMinutes === null || durationMinutes < 1) {
    return "A duração deve ser um número inteiro maior que zero.";
  }
  if (videoRaw && !isHttpUrl(videoRaw)) {
    return "Informe uma URL de vídeo válida (http ou https).";
  }
  return {
    title,
    body,
    videoUrl: videoRaw || null,
    sortOrder,
    durationMinutes,
  };
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
