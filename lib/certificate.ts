import { randomBytes } from "crypto";
import type { Certificate } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function createCertificateCode(): string {
  const left = randomBytes(3).toString("hex").toUpperCase();
  const right = randomBytes(2).toString("hex").toUpperCase();
  return `CAP-${left}-${right}`;
}

export async function issueCertificateIfComplete(
  enrollmentId: string,
): Promise<Certificate | null> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: true,
      course: { include: { lessons: true } },
      lessonProgress: true,
      certificate: true,
    },
  });
  if (!enrollment) {
    return null;
  }
  if (enrollment.certificate) {
    return enrollment.certificate;
  }
  const totalLessons = enrollment.course.lessons.length;
  const completedLessons = enrollment.lessonProgress.length;
  if (totalLessons === 0 || completedLessons < totalLessons) {
    return null;
  }
  return prisma.certificate.create({
    data: {
      enrollmentId,
      issuedName: enrollment.user.name,
      code: createCertificateCode(),
    },
  });
}
