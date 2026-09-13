"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/action-result";
import {
  parseCourseForm,
  parseLessonForm,
  readTrimmedField,
} from "@/lib/admin-form";
import { authorizeAdminAction } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdminOrFail(): Promise<ActionResult | null> {
  const auth = await authorizeAdminAction();
  if (!auth.ok) {
    return auth;
  }
  return null;
}

function readId(formData: FormData, key: string): string {
  return readTrimmedField(formData, key);
}

export async function createCourseAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdminOrFail();
  if (denied) {
    return denied;
  }
  const parsed = parseCourseForm(formData);
  if (typeof parsed === "string") {
    return { ok: false, message: parsed };
  }
  let courseId = "";
  try {
    const course = await prisma.course.create({ data: parsed });
    courseId = course.id;
  } catch (error) {
    return mapCourseWriteError(error);
  }
  redirect(`/admin/courses/${courseId}?created=1`);
}

export async function updateCourseAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdminOrFail();
  if (denied) {
    return denied;
  }
  const courseId = readId(formData, "courseId");
  if (!courseId) {
    return { ok: false, message: "Curso inválido." };
  }
  const parsed = parseCourseForm(formData);
  if (typeof parsed === "string") {
    return { ok: false, message: parsed };
  }
  try {
    await prisma.course.update({
      where: { id: courseId },
      data: parsed,
    });
  } catch (error) {
    return mapCourseWriteError(error);
  }
  redirect(`/admin/courses/${courseId}?saved=1`);
}

export async function deleteCourseAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdminOrFail();
  if (denied) {
    return denied;
  }
  const courseId = readId(formData, "courseId");
  if (!courseId) {
    return { ok: false, message: "Curso inválido." };
  }
  const enrollmentCount = await prisma.enrollment.count({
    where: { courseId },
  });
  if (enrollmentCount > 0) {
    return {
      ok: false,
      message:
        "Não é possível excluir: existem inscrições neste curso. Remova as inscrições antes ou desative o curso.",
    };
  }
  await prisma.course.delete({ where: { id: courseId } });
  redirect("/admin?deleted=1");
}

export async function createLessonAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdminOrFail();
  if (denied) {
    return denied;
  }
  const courseId = readId(formData, "courseId");
  if (!courseId) {
    return { ok: false, message: "Curso inválido." };
  }
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });
  if (!course) {
    return { ok: false, message: "Curso não encontrado." };
  }
  const parsed = parseLessonForm(formData);
  if (typeof parsed === "string") {
    return { ok: false, message: parsed };
  }
  await prisma.lesson.create({
    data: {
      ...parsed,
      courseId,
    },
  });
  redirect(`/admin/courses/${courseId}?lessonCreated=1`);
}

export async function updateLessonAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdminOrFail();
  if (denied) {
    return denied;
  }
  const courseId = readId(formData, "courseId");
  const lessonId = readId(formData, "lessonId");
  if (!courseId || !lessonId) {
    return { ok: false, message: "Aula inválida." };
  }
  const parsed = parseLessonForm(formData);
  if (typeof parsed === "string") {
    return { ok: false, message: parsed };
  }
  const updated = await prisma.lesson.updateMany({
    where: { id: lessonId, courseId },
    data: parsed,
  });
  if (updated.count === 0) {
    return { ok: false, message: "Aula não encontrada." };
  }
  redirect(`/admin/courses/${courseId}?lessonSaved=1`);
}

export async function deleteLessonAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdminOrFail();
  if (denied) {
    return denied;
  }
  const courseId = readId(formData, "courseId");
  const lessonId = readId(formData, "lessonId");
  if (!courseId || !lessonId) {
    return { ok: false, message: "Aula inválida." };
  }
  const deleted = await prisma.lesson.deleteMany({
    where: { id: lessonId, courseId },
  });
  if (deleted.count === 0) {
    return { ok: false, message: "Aula não encontrada." };
  }
  redirect(`/admin/courses/${courseId}?lessonDeleted=1`);
}

export async function reorderLessonAction(
  formData: FormData,
): Promise<void> {
  const denied = await requireAdminOrFail();
  if (denied) {
    redirect("/catalog");
  }
  const courseId = readId(formData, "courseId");
  const lessonId = readId(formData, "lessonId");
  const direction = readTrimmedField(formData, "direction");
  if (!courseId || !lessonId || (direction !== "up" && direction !== "down")) {
    redirect("/admin");
  }
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: { id: true, sortOrder: true },
  });
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= lessons.length) {
    redirect(`/admin/courses/${courseId}`);
  }
  const reordered = [...lessons];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(swapIndex, 0, moved);
  await prisma.$transaction(
    reordered.map((lesson, orderIndex) =>
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { sortOrder: orderIndex + 1 },
      }),
    ),
  );
  redirect(`/admin/courses/${courseId}`);
}

function mapCourseWriteError(error: unknown): ActionResult {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      ok: false,
      message: "Já existe um curso com este endereço (slug).",
    };
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return { ok: false, message: "Curso não encontrado." };
  }
  throw error;
}
