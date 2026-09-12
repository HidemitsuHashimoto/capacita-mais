"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { readSessionUser } from "@/lib/auth";
import { enrollUserInCourse, EnrollmentError } from "@/lib/enrollment";

export async function enrollAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await readSessionUser();
  if (!user) {
    return {
      ok: false,
      message: "Entre na sua conta para se inscrever.",
    };
  }
  const courseId = String(formData.get("courseId") ?? "");
  if (!courseId) {
    return { ok: false, message: "Curso inválido." };
  }
  try {
    await enrollUserInCourse({ userId: user.id, courseId });
  } catch (error) {
    if (error instanceof EnrollmentError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
  redirect("/me/courses");
}
