import type { Certificate, Course, Enrollment, Lesson } from "@/generated/prisma/client";
import { issueCertificateIfComplete } from "@/lib/certificate";
import { prisma } from "@/lib/prisma";

export class ProgressError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "ProgressError";
  }
}

type MarkCompleteInput = {
  userId: string;
  courseId: string;
  lessonId: string;
};

export type EnrollmentProgress = {
  enrollment: Enrollment & {
    course: Course & { lessons: Lesson[] };
    certificate: Certificate | null;
  };
  completedLessonIds: string[];
  totalLessons: number;
  completedLessons: number;
  percent: number;
};

export async function markLessonComplete(
  input: MarkCompleteInput,
): Promise<void> {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: input.userId,
        courseId: input.courseId,
      },
    },
    include: { course: { include: { lessons: true } } },
  });
  if (!enrollment) {
    throw new ProgressError(
      "NOT_ENROLLED",
      "Você precisa estar inscrito para concluir esta aula.",
    );
  }
  const lesson = enrollment.course.lessons.find(
    (item) => item.id === input.lessonId,
  );
  if (!lesson) {
    throw new ProgressError("LESSON_NOT_FOUND", "Aula não encontrada.");
  }
  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: enrollment.id,
        lessonId: input.lessonId,
      },
    },
    update: {},
    create: {
      enrollmentId: enrollment.id,
      lessonId: input.lessonId,
    },
  });
  await issueCertificateIfComplete(enrollment.id);
}

export async function readEnrollmentProgress(
  enrollmentId: string,
): Promise<EnrollmentProgress | null> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: { include: { lessons: { orderBy: { sortOrder: "asc" } } } },
      lessonProgress: true,
      certificate: true,
    },
  });
  if (!enrollment) {
    return null;
  }
  const totalLessons = enrollment.course.lessons.length;
  const completedLessons = enrollment.lessonProgress.length;
  const percent =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  return {
    enrollment,
    completedLessonIds: enrollment.lessonProgress.map((item) => item.lessonId),
    totalLessons,
    completedLessons,
    percent,
  };
}

export function computeProgressPercent(
  completedLessons: number,
  totalLessons: number,
): number {
  if (totalLessons === 0) {
    return 0;
  }
  return Math.round((completedLessons / totalLessons) * 100);
}
