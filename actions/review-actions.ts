"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { readSessionUser } from "@/lib/auth";

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
  void user;
  void rating;
  void comment;
  if (!slug) {
    return { ok: false, message: "Curso inválido." };
  }
  redirect(`/courses/${slug}?reviewed=1`);
}
