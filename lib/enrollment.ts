import { Prisma } from "@prisma/client";
import type { Enrollment } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class EnrollmentError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "EnrollmentError";
  }
}

type EnrollInput = {
  userId: string;
  courseId: string;
};

export async function enrollUserInCourse(
  input: EnrollInput,
): Promise<Enrollment> {
  try {
    return await prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: input.courseId },
      });
      if (!course) {
        throw new EnrollmentError("NOT_FOUND", "Curso não encontrado.");
      }
      const existing = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: input.userId,
            courseId: input.courseId,
          },
        },
      });
      if (existing) {
        throw new EnrollmentError(
          "ALREADY_ENROLLED",
          "Você já está inscrito neste curso.",
        );
      }
      const enrolledCount = await tx.enrollment.count({
        where: { courseId: input.courseId },
      });
      if (enrolledCount >= course.maxSeats) {
        throw new EnrollmentError(
          "NO_SEATS",
          "Não há vagas disponíveis neste curso.",
        );
      }
      return tx.enrollment.create({
        data: {
          userId: input.userId,
          courseId: input.courseId,
        },
      });
    });
  } catch (error) {
    if (error instanceof EnrollmentError) {
      throw error;
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new EnrollmentError(
        "ALREADY_ENROLLED",
        "Você já está inscrito neste curso.",
      );
    }
    throw error;
  }
}

export async function countRemainingSeats(courseId: string): Promise<number> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { maxSeats: true },
  });
  if (!course) {
    return 0;
  }
  const enrolledCount = await prisma.enrollment.count({
    where: { courseId },
  });
  return Math.max(0, course.maxSeats - enrolledCount);
}

export async function findEnrollmentForUser(input: {
  userId: string;
  courseId: string;
}): Promise<Enrollment | null> {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: input.userId,
        courseId: input.courseId,
      },
    },
  });
}
