"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/action-result";
import {
  clearSessionCookie,
  writeSessionCookie,
} from "@/lib/auth";
import { readSafePath } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const BCRYPT_COST = 10;
const MIN_PASSWORD_LENGTH = 8;

function readTrimmed(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = readTrimmed(formData, "name");
  const email = readTrimmed(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name) {
    return { ok: false, message: "Informe o nome completo." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, message: "Informe um e-mail válido." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    };
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ALUNO",
      },
    });
    await writeSessionCookie({ userId: user.id, role: user.role });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "Este e-mail já está cadastrado." };
    }
    throw error;
  }
  redirect("/me/courses");
}

export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = readTrimmed(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = readSafePath(readTrimmed(formData, "next"), "/me/courses");
  if (!isValidEmail(email) || !password) {
    return { ok: false, message: "Informe e-mail e senha." };
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, message: "E-mail ou senha inválidos." };
  }
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { ok: false, message: "E-mail ou senha inválidos." };
  }
  await writeSessionCookie({ userId: user.id, role: user.role });
  redirect(nextPath);
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}
