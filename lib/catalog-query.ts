import type { Course, Prisma } from "@/generated/prisma/client";
import { computeRemainingSeats } from "@/lib/enrollment";
import { prisma } from "@/lib/prisma";

export type CatalogQueryInput = {
  searchTerm?: string;
  isFreeOnly?: boolean;
};

export type CatalogCourse = Course & {
  remainingSeats: number;
};

export function buildCatalogWhere(
  input: CatalogQueryInput,
): Prisma.CourseWhereInput {
  const filters: Prisma.CourseWhereInput[] = [];
  const searchTerm = input.searchTerm?.trim();
  if (searchTerm) {
    filters.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { summary: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }
  if (input.isFreeOnly) {
    filters.push({
      OR: [
        { isFree: true },
        { priceLabel: { equals: "0" } },
        { priceLabel: { equals: "R$ 0" } },
        { priceLabel: { equals: "R$ 0,00" } },
      ],
    });
  }
  if (filters.length === 0) {
    return {};
  }
  if (filters.length === 1) {
    return filters[0];
  }
  return { AND: filters };
}

export async function listCatalogCourses(
  input: CatalogQueryInput,
): Promise<CatalogCourse[]> {
  const courses = await prisma.course.findMany({
    where: buildCatalogWhere(input),
    orderBy: [{ isDemo: "desc" }, { title: "asc" }],
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
  });
  return courses.map(({ _count, ...course }) => ({
    ...course,
    remainingSeats: computeRemainingSeats(course.maxSeats, _count.enrollments),
  }));
}
