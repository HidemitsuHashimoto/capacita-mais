import type { Course, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CatalogQueryInput = {
  searchTerm?: string;
  isFreeOnly?: boolean;
};

export function buildCatalogWhere(
  input: CatalogQueryInput,
): Prisma.CourseWhereInput {
  void input.searchTerm;
  void input.isFreeOnly;
  return {};
}

export async function listCatalogCourses(
  input: CatalogQueryInput,
): Promise<Course[]> {
  return prisma.course.findMany({
    where: buildCatalogWhere(input),
    orderBy: [{ isDemo: "desc" }, { title: "asc" }],
  });
}
