"use server";

import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { readSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateProfileAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await readSessionUser();
  if (!user) {
    return { ok: false, message: "Sessão expirada. Entre novamente." };
  }
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const isPwd = formData.get("isPwd") === "on";
  void phone;
  if (!name) {
    return { ok: false, message: "Informe o nome completo." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      isPwd,
    },
  });
  redirect("/me/profile?saved=1");
}
