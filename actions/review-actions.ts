"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { readSessionUser } from "@/lib/auth";
import { findEnrollmentForUser } from "@/lib/enrollment";
import { prisma } from "@/lib/prisma";
import { computeProgressPercent } from "@/lib/progress";

export async function submitReviewAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await readSessionUser();
  if (!user) {
    return { ok: false, message: "Sessão expirada. Entre novamente." };
  }
  const slug = String(formData.get("slug") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();
  if (!slug) {
    return { ok: false, message: "Curso inválido." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, message: "Escolha uma nota de 1 a 5 estrelas." };
  }
  const course = await prisma.course.findUnique({
    where: { slug },
    include: { lessons: { select: { id: true } } },
  });
  if (!course) {
    return { ok: false, message: "Curso inválido." };
  }
  const enrollment = await findEnrollmentForUser({
    userId: user.id,
    courseId: course.id,
  });
  if (!enrollment) {
    return {
      ok: false,
      message: "Você precisa estar inscrito para avaliar este curso.",
    };
  }
  const completedCount = await prisma.lessonProgress.count({
    where: { enrollmentId: enrollment.id },
  });
  const percent = computeProgressPercent(completedCount, course.lessons.length);
  if (percent !== 100) {
    return {
      ok: false,
      message: "Conclua todas as aulas para avaliar este curso.",
    };
  }
  await prisma.courseReview.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    create: {
      userId: user.id,
      courseId: course.id,
      rating,
      comment: comment || null,
    },
    update: {
      rating,
      comment: comment || null,
    },
  });
  redirect(`/courses/${slug}?reviewed=1`);
}
