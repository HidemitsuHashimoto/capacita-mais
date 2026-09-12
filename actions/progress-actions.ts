"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { readSessionUser } from "@/lib/auth";
import { markLessonComplete, ProgressError } from "@/lib/progress";

export async function completeLessonAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await readSessionUser();
  if (!user) {
    return { ok: false, message: "Sessão expirada. Entre novamente." };
  }
  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const nextPath = String(formData.get("nextPath") ?? "");
  try {
    await markLessonComplete({
      userId: user.id,
      courseId,
      lessonId,
    });
  } catch (error) {
    if (error instanceof ProgressError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
  if (nextPath.startsWith("/")) {
    redirect(nextPath);
  }
  return { ok: true, message: "Aula concluída." };
}
